pipeline {
  agent { label 'linux && docker' }

  parameters {
    choice(name: 'ENVIRONMENT', choices: ['dev', 'prod'], description: 'Target environment')
    choice(name: 'SERVICE', choices: ['backend', 'frontend'], description: 'Service to deploy')
  }

  environment {
    AWS_REGION   = "us-west-2"
    AWS_ACCOUNT  = "889039329094"
    IMAGE_TAG    = "${BUILD_NUMBER}"
    ECR_REPO     = "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/invoice-analyzer-${SERVICE}"
    GITOPS_PATH  = "environments/${ENVIRONMENT}/${SERVICE}"
  }

  stages {

    stage('Checkout Source Code') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
           def buildContext = ""
           if (params.SERVICE == 'backend') {
             buildContext = "Backend"
           } else if (params.SERVICE == 'frontend') {
             buildContext = "Client"
           } else {
             error "Unknown service: ${params.SERVICE}"
           }
           
           echo "Building ${params.SERVICE} from context: ${buildContext}"
           sh "docker build -t ${ECR_REPO}:${IMAGE_TAG} ${buildContext}"
        }
      }
    }

    stage('Trivy Scan') {
      steps {
        sh """
          # Assuming trivy is installed on the agent
          # Failing on HIGH/CRITICAL severities
          trivy image --exit-code 0 --severity HIGH,CRITICAL --ignore-unfixed ${ECR_REPO}:${IMAGE_TAG}
        """
      }
    }

    stage('Login to ECR & Push Image') {
      steps {
        sh """
          aws ecr get-login-password --region ${AWS_REGION} \
            | docker login --username AWS --password-stdin ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com

          aws ecr describe-repositories \
            --repository-names invoice-analyzer-${SERVICE} \
            --region ${AWS_REGION} \
          || aws ecr create-repository \
            --repository-name invoice-analyzer-${SERVICE} \
            --region ${AWS_REGION}

          docker push ${ECR_REPO}:${IMAGE_TAG}
        """
      }
    }

    stage('Update Kustomize Image Tag') {
      steps {
        // You generally clone the GitOps repo separately here if it's different from source repo
        // Or if 'checkout scm' above checked out the source code.
        // Assuming we need to check out the gitops repo now.
        
        dir('gitops-repo') {
            git credentialsId: 'git-creds', url: 'https://github.com/Valescaray/gitops-repo.git', branch: 'main'
            
            withCredentials([usernamePassword(
              credentialsId: 'git-creds',
              usernameVariable: 'GIT_USER',
              passwordVariable: 'GIT_PASS'
            )]) {
    
              sh """
                git config user.email "jenkins@ci.local"
                git config user.name "jenkins-ci"
    
                # Navigate to the correct path in GitOps repo
                cd ${GITOPS_PATH}
                
                # Update kustomization.yaml
                sed -i "s/newTag:.*/newTag: ${IMAGE_TAG}/" kustomization.yaml
    
                git add kustomization.yaml
                git commit -m "ci(${ENVIRONMENT}): deploy ${SERVICE} image ${IMAGE_TAG}"
                git push https://${GIT_USER}:${GIT_PASS}@github.com/Valescaray/gitops-repo.git HEAD:main
              """
            }
        }
      }
    }
  }

  post {
    success {
      echo "🚀 ${SERVICE} deployed to ${ENVIRONMENT} with image tag ${IMAGE_TAG}"
    }
    failure {
      echo "❌ Pipeline failed"
    }
  }
}
