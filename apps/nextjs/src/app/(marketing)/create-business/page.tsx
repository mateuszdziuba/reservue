"use client";

import { motion } from "framer-motion";
import { Balancer } from "react-wrap-balancer";

import { CreateBusinessForm } from "~/components/create-business-form";

export default function CreateBusiness() {
  return (
    <motion.div
      className="my-auto flex h-full w-full flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="bg-background/60 flex flex-col rounded-xl p-8"
      >
        <motion.h1
          className="font-cal mb-4 text-2xl font-bold transition-colors sm:text-3xl"
          variants={{
            hidden: { opacity: 0, x: 250 },
            show: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.4, type: "spring" },
            },
          }}
        >
          <Balancer>
            {`Dodaj swoją firmę, aby dalej korzystać z aplikacji`}
          </Balancer>
        </motion.h1>
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 100 },
            show: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.4, type: "spring" },
            },
          }}
        >
          <CreateBusinessForm />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
