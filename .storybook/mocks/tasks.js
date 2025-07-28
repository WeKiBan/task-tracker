import { mockSubtasks } from "./subtasks";
import { mockLinks } from "./links";
import { mockProjects } from "./projects";

export const mockTasks = [
  {
    id: 1,
    order: 1,
    title: "GAZZAMOTOR-1667",
    status: "inProgress",
    link: "#",
    description:
      "This task involves updating the motor section with the latest articles and reviews.",
    notes:
      "Waiting for the final approval from the content team. Ensure to follow the motor guidelines.",
    emailNotes:
      "Sent an update to the client regarding the changes. Awaiting feedback.",
    subtasks: [...mockSubtasks],
    links: [...mockLinks],
    projects: [...mockProjects],
  },
  {
    id: 2,
    order: 2,
    title: "GAZZETTA-9225",
    status: "closed",
    link: "#",
    description: "Task completed: Resolved UI issues in the homepage carousel.",
    notes: "All tests passed, and the carousel issue has been fixed.",
    emailNotes: "Informed the team about the successful deployment.",
    subtasks: [...mockSubtasks],
    links: [...mockLinks],
    projects: [...mockProjects],
  },
  {
    id: 3,
    order: 3,
    title: "GAZZETTA-8414",
    status: "blocked",
    link: "#",
    description:
      "Blocked due to a dependency on the Instagram API integration.",
    notes: "Waiting for Instagram's approval for API access.",
    emailNotes: "Emailed the client about the delay in API approval.",
    subtasks: [...mockSubtasks],
    links: [...mockLinks],
    projects: [...mockProjects],
  },
  {
    id: 4,
    order: 4,
    title: "GAZZAMOTOR-1667",
    status: "inProgress",
    link: "#",
    description:
      "Implementing the latest design changes for the motor review page.",
    notes: "Design team made some last-minute adjustments.",
    emailNotes: "Sent design revisions to the client for approval.",
    subtasks: [...mockSubtasks],
    links: [...mockLinks],
    projects: [...mockProjects],
  },
  {
    id: 5,
    order: 5,
    title: "GAZZETTA-9225",
    status: "closed",
    link: "#",
    description:
      "Finalized the implementation of the site search functionality.",
    notes: "All functional and UI tests have passed successfully.",
    emailNotes: "Notified the product team of the feature launch.",
    subtasks: [...mockSubtasks],
    links: [...mockLinks],
    projects: [...mockProjects],
  },
  {
    id: 6,
    order: 6,
    title: "GAZZETTA-8414",
    status: "blocked",
    link: "#",
    description:
      "API integration stalled due to rate-limiting issues from Instagram.",
    notes:
      "Monitoring the API rate limits and exploring alternative solutions.",
    emailNotes: "Notified the project manager about the potential delays.",
    subtasks: [...mockSubtasks],
    links: [...mockLinks],
    projects: [...mockProjects],
  },
];
