# BestBeFed

- [Iteration 02 - Review & Retrospect](#iteration-02---review--retrospect)
- [Process - Reflection](#process---reflection)
    - [Q1. Decisions that turned out well](#q1-decisions-that-turned-out-well)
    - [Q2. Decisions that did not turn out as well as we hoped](#q2-decisions-that-did-not-turn-out-as-well-as-we-hoped)
    - [Q3. Planned changes](#q3-planned-changes)
- [Product - Review](#product---review)
    - [Q4. How was your product demo?](#q4-how-was-your-product-demo)

## Iteration 02 - Review & Retrospect

 * When: Friday, November 4 @ 1:00 PM
 * Where: Online (Discord group call)

## Process - Reflection
#### Q1. Decisions that turned out well

1. **Following Agile Development and using JIRA to keep track of tasks**

    *Key Ideas*: allowed us to remember what features need to be implemented even if we weren’t able to work on the project for a while

    In the spirit of making our processes as efficient as possible, our team committed to using the Agile style of development along with JIRA to track all of the tasks that we were working on. We would have true Sprints, where we would sit down together and plan out and create tickets for all the tasks at the beginning. Then, we would start the 2 week iteration of project development including all the tasks that we could reasonably complete in the time frame.

    Ultimately, one of the most valuable effects that team members noticed arose from this decision was that when other courses got very busy and no one had time to work for a few days, we would be able to go back to the Sprint Board on JIRA and see what needed to be done and how it should be completed. This allowed us to get back into the development mindset for our project as quickly as possible. Beyond this, having tickets for each task made it easy to see which member was working on which feature, so when any features were interdependent, members knew who to communicate with immediately, and wouldn’t have to waste time figuring it out on their own.

    Finally, in true Sprint fashion, having short review and retrospective meetings helped us figure out what we needed to add to our project or how we could improve it, and how we could improve our processes incrementally to minimize overhead and waste of time during the development process.

2. **Having ad-hoc communications on discord**

    *Key Ideas*: we could keep each other updated on progress and ask for clarification ad-hoc

    As a team, we decided that most of our communications would take place asynchronously over Discord; synchronous meetings would be kept for planning, progress updates, and Agile-type meetings. We had a Discord server where all members could communicate with each other, and had multiple channels that corresponded to a different aspect of the project (frontend, backend, feature-planning, etc.). Team members were encouraged to engage in discussions about how features should be implemented often, and to ask for help or clarification whenever necessary. The whole team did their best to foster an accepting and safe environment where anyone could feel free to ask anything without judgment. This led to one or two team members actively jumping on an issue anytime someone else brought one up so it could be resolved as soon as possible, minimizing the amount of time an individual member spent blocked or idle on a task. Overall, this workflow of ad-hoc communications on Discord was ideal, because members only had to discuss things as they came up; they could work independently or in pairs, without interruptions, on features the rest of the time.

3. **Deciding to have members focus on specific tasks/part of the stack**

    *Key Ideas*: allowed us to get better familiarized with our part of the stack, write better code for it, and spend more time designing it to work efficiently properly (e.g., we had more time to design the database, create our models, use our ORM)

    In our initial planning stages for the development process of the project, we determined that it would be best if members either focused only on a specific part of the stack or the product, or focused more on one part than others. We figured that this would make it easier for members to learn what they needed and complete features in time for the closely approaching deadlines for deliverables and the final product. Further, it would give each member more time to design and perfect the features they were working on, and specialize their knowledge as much as they could so they could help out fellow teammates working on the same part of the stack.

    In practice, this seemed to work exactly as we planned, and testaments from some of the team members provide concrete examples of this. Michael was able to spend time focusing only on the Register and Login pages on the frontend, where he was able to learn more about React and figure out how to leverage React’s Hooks feature to make very responsive pages. Matthew and Kevin were able to take the time to focus on learning how to use the TypeORM library and set up and connect to both local and cloud-based PostgreSQL Databases to achieve efficient and easily-understandable flow of data in the backend. Ultimately, a lot of this would not have been possible if members had to constantly divide their attention amongst all elements of the tech stack.

#### Q2. Decisions that did not turn out as well as we hoped

1. **Choosing not to have all of our scheduled SCRUM meetings**

    *Key Ideas*: sometimes we went a little too long without regrouping and ensuring that everyone was on the same page or figuring out how we needed to coordinate amongst ourselves to put individual parts that we worked on together

    As a team, we initially decided on having 1-2 standup meetings where we would discuss our progress and or discuss design of specific features in more detail. However, as people have plenty of commitments, it was difficult to find times where everyone was willing to have a meeting, so we decided to just forego having the majority of our standup meetings. In retrospect, this made the development process a lot less smooth, because when it came time to start building the main features of the website, it was clear that a lot of members were confused with how to proceed.

    Some notable miscommunications and points of confusion that arose include: not knowing or remembering what the exact requirements for a specific feature were, not being informed of updated requirements for a feature, not being aware of when an intended deadline for a feature was, not knowing that someone was blocked on a feature, and not delegating tasks efficiently where one member’s task depended on another member completing their task first. While the development of this stage of the project was still successful, it was definitely slightly more stressful and inefficient than it could have been had we held standup meetings more often.

2. **Choosing to not spend time planning out specifics of UI and program design**

    *Key Ideas*: We have some inconsistent themes in UI across our platform that will require extra time and effort to rework (could have been avoided) and certain styles of code that are not uniform across different parts of the app (very few at least)

    In part because of our failure to have all our scheduled SCRUM meetings, a few key coordination decisions went without consideration or planning. Throughout our development process; meetings, impromptu discussions and ticket formulation, we never had an indepth discussion about the appearance of our product. The extent of our planning on this front was the creation of a logo in a single meeting after which the matter was never again discussed. This error is not without justification - backend implementation details, database relationships and task delegation were all much more important considerations but in the end our neglect led to an inconsistent theme across the UI of our program. Most obviously, the user login and registration pages share a similar theme, appearance and color scheme, while our landing page appears completely different as though representing a different program.

    For the time being, this is not a significant issue but will take time in the future to correct and rework. Time that would perhaps better spent implementing more key features. Additionally, there was a failure to discuss uniformity of style across the backend and the frontend. While this is not a key issue at this stage of development, as functionality supercedes all, it does pose a challenge to code reusability and readability in the future and will require extra work to correct and make uniform. A key example of this disjoint style issue appears in the implementation of the React components representing the login page and cart pages, the former using function based components while the latter uses class based components.

#### Q3. Planned changes

1. **Spend time planning**

    Throughout the process of building up the rest of our project, we will make a commitment to thoroughly planning out our development processes at the beginning of each sprint and concretely designing the UI and code structure of features before implementing them. As explained in the second decision that did not turn out well above, the lack of planning and design before implementation of features led to widespread inconsistencies in the interface and codebase of our product. These are issues that we will now need to spend plenty of time rectifying, bringing all code under one particular style or set of design patterns and making the UI of all features match the same theme. This takes away time from working on the features that have not yet been implemented, and thus adds more pressure and stress to each team member. Thus, in order to prevent this kind of issue from happening repeatedly, we can spend more time planning things out so every member will be on the same page and up-to-date with how things should be implemented in our product.

2. **Having synchronous, live meetings at least once a week to regroup as a team (with more meetings as we get closer to the deadline)**

    As a way of combating the issues described in the first decision that did not go well in the above section, we will commit to actually holding our SCRUM standup meetings once or twice every week. This will help us ensure that as we iteratively re-define the requirements for specific features or get blocked on specific tasks, all team members will be made aware of it. Overall, it will help with synchronizing all the knowledge regarding the features of the project amongst all members, which will help minimize confusion and reduce the amount of time members spend confused or idle. 

    As we approach the final deadline for the project, we will ideally have 4-5 synchronous standup meetings; around this time, it is inevitable that lots of progress will be made quickly, so it is necessary for all members to be in the loop regarding what has been done in the past day. If we stick to this, it is unlikely that we will run into as many last minute issues as we did in this past iteration of development, which mainly happened due to members not being fully aware of all the progress that others were making.

3. **Planning UI appearance and themes well in advance of implementation, discussing code style uniformity across the project**

    As we move closer towards the deadline of the project, the appearance and UI of the program becomes more important as the reality of non-testing use becomes more pertinent. To this end, a uniform theme, appearance and adoption of interactive media principles across all aspects of our frontend becomes a key point of discussion. Having made the mistake of delaying such a conversation in the past, it is especially important that in advance of any more work being done on the frontend, a detail oriented discussion concerning these issues is had; pages planned and sketched, icons and images designed or chosen.

    Remaining on the theme of uniformity, a similar discussion must also be had about style uniformity across the front end and backend. Using similar style is not a paramount concern, however, it would aid with code readability, both for team members reviewing the code written without their involvement and for potential programmers who inherit the code base in the future. For these reasons, a discussion about some loose style guidelines for both frontend and backend seems a worthwhile exercise. While these concerns may seem aesthetic, their resolution could lend concrete and functional advantages.

## Product - Review

#### Q4. How was your product demo?

As this project is self-proposed, we did not have a product demo (Not Applicable).
