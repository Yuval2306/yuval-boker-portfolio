export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  repoUrl: string;
  readmeUrl: string;
  image: string;
  featured?: boolean; // ✅ add this
};


const gh = (repo: string) => `https://github.com/Yuval2306/${repo}`;

export const projects: Project[] = [
    {
  slug: "Autocomplete-Algorithm",
  title: "Google Project – Autocomplete Algorithm",
  description: "Autocomplete algorithm implementation",
  tags: ["Python", "Algorithms"],
  repoUrl: gh("Autocomplete-Algorithm"),
  readmeUrl: `${gh("Autocomplete-Algorithm")}#readme`,
  image: "/projects/Autocomplete-Algorithm.png",
  featured: true,
  },
  {
    slug: "movie-search-app",
    title: "Movie Search App",
    description: "Movie search app",
    tags: ["JavaScript", "Frontend"],
    repoUrl: gh("movie-search-app"),
    readmeUrl: `${gh("movie-search-app")}#readme`,
    image: "/projects/movie-search-app.png",
  },
  {
    slug: "gradebook-app",
    title: "Gradebook App",
    description: "Gradebook application",
    tags: ["JavaScript", "Frontend"],
    repoUrl: gh("gradebook-app"),
    readmeUrl: `${gh("gradebook-app")}#readme`,
    image: "/projects/gradebook-app.png",
    featured: true,
  },
  {
    slug: "android-trivia-quiz",
    title: "Android Trivia Quiz",
    description: "Android trivia quiz app with login, SQLite persistence, and score history",
    tags: ["Java", "Android", "SQLite"],
    repoUrl: gh("android-trivia-quiz"),
    readmeUrl: `${gh("android-trivia-quiz")}#readme`,
    image: "/projects/android-trivia-quiz.png",
  },
  {
    slug: "mixed-integer-pso",
    title: "Mixed Integer PSO",
    description: "Dynamic PSO for mixed-integer quadratic optimization",
    tags: ["Python", "Optimization"],
    repoUrl: gh("mixed-integer-pso"),
    readmeUrl: `${gh("mixed-integer-pso")}#readme`,
    image: "/projects/mixed-integer-pso.png",
  },
  {
    slug: "meshflow-video-stabilization",
    title: "MeshFlow Video Stabilization",
    description: "Real-time video stabilization using a MeshFlow-based approach",
    tags: ["Python", "Computer Vision"],
    repoUrl: gh("meshflow-video-stabilization"),
    readmeUrl: `${gh("meshflow-video-stabilization")}#readme`,
    image: "/projects/meshflow-video-stabilization.png",
  },
  {
    slug: "data-analysis-final-project",
    title: "Data Analysis Final Project",
    description: "Python data analysis notebook demonstrating structured analytical workflow",
    tags: ["Jupyter", "Python", "Data"],
    repoUrl: gh("data-analysis-final-project"),
    readmeUrl: `${gh("data-analysis-final-project")}#readme`,
    image: "/projects/data-analysis-final-project.png",
  },
  {
    slug: "containerized-code-execution",
    title: "Containerized Code Execution",
    description: "Linux-based system for executing code in isolated Docker containers",
    tags: ["Python", "Linux", "Docker"],
    repoUrl: gh("containerized-code-execution"),
    readmeUrl: `${gh("containerized-code-execution")}#readme`,
    image: "/projects/containerized-code-execution.png",
  },
  {
    slug: "myfs-linux-filesystem",
    title: "MyFS Linux Filesystem",
    description: "Custom Linux filesystem project",
    tags: ["C++", "Linux", "File Systems"],
    repoUrl: gh("myfs-linux-filesystem"),
    readmeUrl: `${gh("myfs-linux-filesystem")}#readme`,
    image: "/projects/myfs-linux-filesystem.png",
    featured: true,
  },
  {
    slug: "minimal-linux-container",
    title: "Minimal Linux Container",
    description: "Minimal container setup / tooling",
    tags: ["Shell", "Linux"],
    repoUrl: gh("minimal-linux-container"),
    readmeUrl: `${gh("minimal-linux-container")}#readme`,
    image: "/projects/minimal-linux-container.png",
  },
  {
    slug: "SlideSummarizer-AI",
    title: "SlideSummarizer AI",
    description: "AI-based slide summarization project",
    tags: ["Python", "AI"],
    repoUrl: gh("SlideSummarizer-AI"),
    readmeUrl: `${gh("SlideSummarizer-AI")}#readme`,
    image: "/projects/SlideSummarizer-AI.png",
    featured: true,
  },
  {
    slug: "football-results-app",
    title: "Football Results App",
    description: "Football results application",
    tags: ["Java"],
    repoUrl: gh("football-results-app"),
    readmeUrl: `${gh("football-results-app")}#readme`,
    image: "/projects/football-results-app.png",
  },

];
