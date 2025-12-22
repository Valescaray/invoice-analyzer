import { motion } from "framer-motion";
import { buttonVariants } from "../ui/button-variants";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";
import HeroBadge from "../ui/hero-badge";

const ease = [0.16, 1, 0.3, 1];

function HeroContent({
  title,
  titleHighlight,
  description,
  primaryAction,
  secondaryAction,
}) {
  return (
    <div className="flex flex-col space-y-4">
      <motion.h1
        className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
      >
        {title}{" "}
        {titleHighlight && (
          <span className="text-primary">{titleHighlight}</span>
        )}
      </motion.h1>
      <motion.p
        className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8, ease }}
      >
        {description}
      </motion.p>
      <motion.div
        className="flex flex-col sm:flex-row gap-4 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease }}
      >
        {primaryAction && (
          <Link
            to={primaryAction.href}
            className={cn(
              buttonVariants({ size: "lg" }),
              "gap-2 w-full sm:w-auto justify-center"
            )}
          >
            {primaryAction.icon}
            {primaryAction.text}
          </Link>
        )}
        {secondaryAction && (
          <Link
            to={secondaryAction.href}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2 w-full sm:w-auto justify-center"
            )}
          >
            {secondaryAction.icon}
            {secondaryAction.text}
          </Link>
        )}
      </motion.div>
    </div>
  );
}

const Hero = ({ pill, content, preview }) => {
  return (
    <div className="container relative overflow-hidden">
      <div className="flex min-h-[calc(100vh-64px)] flex-col lg:flex-row items-center py-8 px-4 md:px-8 lg:px-12">
        <div className="flex flex-col gap-4 w-full lg:max-w-2xl">
          {pill && <HeroBadge {...pill} />}
          <HeroContent {...content} />
        </div>
        {preview && (
          <div className="w-full lg:max-w-xl lg:pl-16 mt-12 lg:mt-0">
            {preview}
          </div>
        )}
      </div>
    </div>
  );
};

export { Hero };
