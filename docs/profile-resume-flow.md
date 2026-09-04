# Career Profile → Resume Import

```mermaid
flowchart TD
  A[Open Settings → Profile] --> B[GET /api/user/profile]
  B --> C{A profile resume exists?}
  C -- No --> D[Show an empty profile form]
  C -- Yes --> E[Load the hidden PROFILE resume and its sections]
  D --> F[User clicks Save Profile]
  E --> F
  F --> G[PATCH /api/user/profile]
  G --> H{profileResumeId exists?}
  H -- No --> I[Create one hidden PROFILE resume]
  H -- Yes --> J[Reuse existing PROFILE resume]
  I --> K[PATCH /api/resume/profileResumeId]
  J --> K
  K --> L[Save personal info, experience, education, skills, and other sections]

  M[Create Resume] --> N{Saved profile exists?}
  N -- No --> O[Create blank DRAFT resume]
  N -- Yes --> P[User chooses Auto-fill]
  P --> Q[Create blank DRAFT resume]
  Q --> R[Read PROFILE resume]
  R --> S[Copy field values without database IDs]
  S --> T[PATCH new resume ID]
  T --> U[Create new child rows with the new resumeId]
  U --> V[Open resume editor]
```

The profile resume has status `PROFILE` and is excluded from normal resume lists. Import is a one-time snapshot copy: no profile row or section row is shared with an imported resume. Editing either one therefore cannot update the other.
