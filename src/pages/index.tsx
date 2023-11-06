import type { NextPage } from "next";
import Head from "next/head";
import Button from "@/components/atoms/button";
import CopyButton from "@/components/molecules/copy-button";
import Feature, { FeatureProps } from "@/components/molecules/feature";

import styles from "./index.module.css";
import { LineChart } from "@/components/charts/line-chart";
import { LineChartRemovedGap } from "@/components/charts/line-chart-removed-gap";

const features: FeatureProps[] = [
  {
    title: "Next",
    description:
      "Best developer experience with all the features you need for production: hybrid static & server rendering",
    link: "https://nextjs.org/",
  },
  {
    title: "React",
    description: "JavaScript library for building user interfaces.",
    link: "https://reactjs.org/",
  },
  {
    title: "TypeScript",
    description:
      "Strongly typed programming language that builds on JavaScript.",
    link: "https://www.typescriptlang.org/",
  },
  {
    title: "Tailwind with JIT",
    description: "A utility-first CSS framework packed with classes.",
    link: "https://tailwindcss.com/",
  },
  {
    title: "Jest",
    description: "Testing Framework with a focus on simplicity.",
    link: "https://jestjs.io/",
  },
  {
    title: "Dark Mode",
    description: "Dark theme support for CSS-Modules and Tailwind.",
    link: "https://tailwindcss.com/docs/dark-mode",
  },
  {
    title: "CSS Modules",
    description:
      "CSS file in which all class names and animation names are scoped locally by default.",
    link: "https://github.com/css-modules/css-modules",
  },
  {
    title: "ESLint",
    description: "Find and fix problems in your JavaScript code.",
    link: "https://eslint.org/",
  },
  {
    title: "Prettier",
    description: "An opinionated code formatter.",
    link: "https://prettier.io/",
  },
  {
    title: "Husky",
    description:
      "Lint your commit messages, run tests, lint code, etc... when you commit or push.",
    link: "https://github.com/typicode/husky",
  },
  {
    title: "Commit-lint",
    description: "Helps your team adhering to a commit convention.",
    link: "https://github.com/conventional-changelog/commitlint",
  },
  {
    title: "Atomic design",
    description:
      "We’re not designing pages, we’re designing systems of components.",
    link: "https://bradfrost.com/blog/post/atomic-web-design/",
  },
  {
    title: "Absolute imports",
    description:
      "Import resource using its full path from the project’s src folder.",
    link: "https://github.com/vitejs/vite/issues/88#issuecomment-762415200",
  },
];

const Home: NextPage = () => {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <LineChartRemovedGap />
      <LineChart />
    </section>
  );
};

export default Home;
