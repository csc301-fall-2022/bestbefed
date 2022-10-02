# Lizardmen Ltd.
> _Note:_ This document is meant to evolve throughout the planning phase of your project.   That is, it makes sense for you commit regularly to this file while working on the project (especially edits/additions/deletions to the _Highlights_ section). Most importantly, it is a reflection of all the planning you work you've done in the first iteration. 
 > **This document will serve as a master plan between your team, your partner and your TA.**

## Product Details
 
#### Q1: What are you planning to build?

 > Short (1 - 2 min' read)
 * Start with a single sentence, high-level description of the product.
 * Be clear - Describe the problem you are solving in simple terms.
 * Be concrete. For example:
    * What are you planning to build? Is it a website, mobile app,
   browser extension, command-line app, etc.?      
    * When describing the problem/need, give concrete examples of common use cases.
    * Assume your the reader knows nothing about the problem domain and provide the necessary context. 
 * Focus on *what* your product does, and avoid discussing *how* you're going to implement it.      
   For example: This is not the time or the place to talk about which programming language and/or framework you are planning to use.
 * **Feel free (and very much encouraged) to include useful diagrams, mock-ups and/or links**.

BestBeFed (formerly “Grocery Store Waste Application”) is a website that will provide an interface between grocery and convenience stores and food banks and individuals in need around the city, allowing the stores to donate food/perishable goods that will not be sold before expiry. The website will also provide a service to the stores that can estimate what subset of their inventory likely won’t be sold before expiry (as the dates approach), taking into account sales and inventory data. This ensures that no product goes to waste while not placing the burden on store owners/managers to keep track of how close to expiry their products are. To support these key functionalities, the website will have one portal for store owners/managers to list all of their stock and optionally manually enter items to list on their storefront as well. In addition, there will be a portal for clients that allows them to search through “menus” for all the storefronts of all participating stores. After submitting an order, users will pick up their items at a scheduled place/time.

We have created some [rough sketches](https://github.com/csc301-fall-2022/team-project-20-grocery-store-waste-app-m/blob/48b4b2da1bbc2e76b0386f83be682d81c93f2ff9/deliverable-1/sketches.pdf) of how we intend for the website to function, from the onboarding experience to the main app screens. We have also designed an [early prototype](https://www.figma.com/proto/x4pxrdPuG4MAUPeZZoD0BX/Initial-Mockup?node-id=3%3A2&scaling=scale-down&page-id=0%3A1&starting-point-node-id=3%3A2) in Figma (still very much a work in progress).


#### Q2: Who are your target users?

  > Short (1 - 2 min' read max)
 * Be specific (e.g. a 'a third-year university student studying Computer Science' and not 'a student')
 * **Feel free to use personas. You can create your personas as part of this Markdown file, or add a link to an external site (for example, [Xtensio](https://xtensio.com/user-persona/)).**

We divide our product up into two main services: the partner-facing service and the client-facing service. This division accurately reflects the two types of users in our service model: the partners are the owners or managers of grocery and convenience stores, while the clients are the owners or managers of food banks or simply individuals in need of food donations.

Example Personas:

**Shanice** is the store manager of a local Loblaws. She worries about the massive amount of fresh produce and meat that goes uneaten and that must be thrown away. She wishes she could do something about it, but corporate tells her it’s cheaper to toss everything in the dumpster.

**Jackson** is the Director of Operations at Helping Hand Food Bank. His goal is to increase the amount of food that is provided to local soup kitchens and food pantries, while minimizing the additional time and money spent.

**Marta** is an individual who is in need of food in a period of financial struggle. The closest food bank is several kilometers away, and she will soon not have enough money to make her car payments. She wishes there was something nearby that she could walk to that offered free food.

#### Q3: Why would your users choose your product? What are they using today to solve their problem/need?

> Short (1 - 2 min' read max)
 * We want you to "connect the dots" for us - Why does your product (as described in your answer to Q1) fits the needs of your users (as described in your answer to Q2)?
 * Explain the benefits of your product explicitly & clearly. For example:
    * Save users time (how much?)
    * Allow users to discover new information (which information? And, why couldn't they discover it before?)
    * Provide users with more accurate and/or informative data (what kind of data? Why is it useful to them?)
    * Does this application exist in another form? If so, how does your differ and provide value to the users?
    * How does this align with your partner's organization's values/mission/mandate?

Both the partners and the clients that our product is geared towards would choose to use it because it connects them to each other in a way that the existing solutions do not. There are currently some apps that sell unsold inventory from restaurants and grocery stores to general customers for cheaper than retail price, but they are profit-focused and don’t seem to optimize the process of mobilizing expiring inventory. We will aim to allow grocery stores to input their current inventory and previous historical sales data to help them determine what subset of their inventory won’t be sold in time. However, we will not force them to donate it if they think they could still sell it, giving them as much freedom as possible. If they choose to donate it, however, this set of their inventory will then be put up on their storefront on our application for the clients to search through. The clients can then choose only what they want to pick up from the partner based on their needs, whereas plenty of existing products seem to only give clients the option for fixed packages of goods. Overall, this model of operation will ideally cut waste and combat hunger locally as efficiently as possible, while still providing choices for consumers and charitable organizations.

#### Q4: How will you build it?

> Short (1-2 min' read max)
 * What is the technology stack? Specify any and all languages, frameworks, libraries, PaaS products or tools. 
 * How will you deploy the application?
 * Describe the architecture - what are the high level components or patterns you will use? Diagrams are useful here. 
 * Will you be using third party applications or APIs? If so, what are they?
 * What is your testing strategy?

In the front-end of our application, we will be using HTML and CSS along with React.js (Javascript). We will have two separate portals - one for the stores and another for the consumers - which will have slightly different functionality, but lots of reusable components. 

In the back-end, we will use Node.js and Express.js along with a PostgreSQL database, which will either be self-managed and hosted on AWS, or set up through the Supabase database service. Supabase would abstract out a lot of the complexities of database setup, allowing us to focus more on the main application logic and architecture. Two major components of the architecture in the backend include a REST API for all route-handling and CRUD operations handled by the application, and a client-facing API that serves as a common interface for all stores to enter their inventory items into our systems, complete with data validation and sanitization.

Further, this application will be deployed as a containerized application on AWS, so we will be making use of Docker along with all of the various AWS services that will facilitate such a deployment (e.g., EC2/Fargate). 

We will ideally implement a structural testing strategy as we develop our product, where we write unit tests after developing features for the application. We will also write automated End-to-End tests using a framework such as Cypress to verify that the flow of execution from the Front-end to the Back-end is working as intended.


#### Q5: What are the user stories that make up the MVP?

 * At least 5 user stories concerning the main features of the application - note that this can broken down further
 * You must follow proper user story format (as taught in lecture) ```As a <user of the app>, I want to <do something in the app> in order to <accomplish some goal>```
 * User stories must contain acceptance criteria. Examples of user stories with different formats can be found here: https://www.justinmind.com/blog/user-story-examples/. **It is important that you provide a link to an artifact containing your user stories**.
 * If you have a partner, these must be reviewed and accepted by them. You need to include the evidence of partner approval (e.g., screenshot from email) or at least communication to the partner (e.g., email you sent)

1. **As a** food bank owner, **I want** to be able to place orders on food items that I need **so that I can** obtain more food and groceries to feed people in need.’

   **Given** a list of possible suppliers in my city, **when I** search for food items I want to purchase, **then** I am provided with a list of grocery stores that have the products I am requesting, ordered by proximity.

2. **As a** grocery store owner/manager, **I want** to be able to donate products that wouldn’t otherwise be sold, **so that I can** reduce food waste and help people in need.

   **Given** that I have provided information on my current stock and sales numbers, **when I** check my in-app inventory, **then** I am provided with a list of products that are likely to expire before sale and can be donated.

3. **As a** grocery store owner, **I want** to edit/remove an item, **so that I can** remove an accidentally added item or update the price.

   **Given** that I have accidentally added an item with the wrong price, **when I** click on the edit button, **then** I am able to adjust the price or remove the item.

4. **As a** food bank owner, **I want** to view a list of possible orders, **so that I can** decide what I want to order

   **Given** that there are multiple possible orders from a store, **when I** click on the store, **then** a list of all the available orders are shown to the user.

5. **As a** consumer, **I want** to be able to review certain stores, **so that** other consumers will know which stores are good

   **Given** that there are multiple stores which I have ordered from, **when I** click on the review button, **then** I am able to rate the store out of 5 stars and leave a message to explain my rating.

----
## Intellectual Property Confidentiality Agreement 
> Note this section is **not marked** but must be completed briefly if you have a partner. If you have any questions, please ask on Piazza.
>  
**By default, you own any work that you do as part of your coursework.** However, some partners may want you to keep the project confidential after the course is complete. As part of your first deliverable, you should discuss and agree upon an option with your partner. Examples include:
1. You can share the software and the code freely with anyone with or without a license, regardless of domain, for any use.
2. You can upload the code to GitHub or other similar publicly available domains.
3. You will only share the code under an open-source license with the partner but agree to not distribute it in any way to any other entity or individual. 
4. You will share the code under an open-source license and distribute it as you wish but only the partner can access the system deployed during the course.
5. You will only reference the work you did in your resume, interviews, etc. You agree to not share the code or software in any capacity with anyone unless your partner has agreed to it.

**Briefly describe which option you have agreed to. Your partner cannot ask you to sign any legally binding agreements or documents pertaining to non-disclosure, confidentiality, IP ownership, etc.**

----

## Process Details

#### Q6: What are the roles & responsibilities on the team?

Describe the different roles on the team and the responsibilities associated with each role. 
 * Roles should reflect the structure of your team and be appropriate for your project. Not necessarily one role to one team member.  
 * Add role(s) to your Team-[Team_Number]-[Team_Name].csv file on the main folder

List each team member and:
 * A description of their role(s) and responsibilities including the components they'll work on and non-software related work
 * 3 technical strengths and weaknesses each (e.g. languages, frameworks, libraries, development methodologies, etc.)


Matthew - Full-stack Engineer, Scrum Master, Product Manager
- Description: Working on the entirety of the codebase, helping out in the front-end but focusing more on the backend. Will help design and implement the architecture of the system (databases, cloud resources, data flow) and write code on the technical side, and then conduct some user research and reach out to clients on the product side. I will also facilitate the SCRUM meetings held by our team. 
- 3 Strengths: JavaScript, Infrastructure, Node + Express
- 3 Weaknesses: Database/Data-intensive system design, automation, prototyping

Daniel - Frontend Engineer, UX/UI Designer, Writer/Researcher
- Description: Focusing on frontend development, building out the web app, designing the user interface and interactions. Also writing documentation, doing user research, general software design (applying design patterns, sorting out details of API).
- 3 Strengths: Figma (designing & prototyping), React, JavaScript/TypeScript
- 3 Weaknesses: Databases (SQL), Backend frameworks, Agile development

Kevin - Backend Engineer
- Description: Focusing on back-end design and implementing the core logic of the app.
- 3 Strengths: Testing, Javascript, API development
- 3 Weaknesses: Cloud technologies, UI design, Express

Edward - Fullstack Engineer
- Description: Working on front-end and back-end development, designing the UI and UX, working on backend to help develop core features, including managing the database.
- 3 Strengths: coding documentation, prototyping, working with APIs
- 3 Weaknesses: time management, cloud computing, databases

Tobey - Full-stack Engineer
- Description: My focus as a full-stack engineer will be to help integrate the dedicated framework and help make many of the key decisions on coding implementation. One of my tasks will be to help develop critical portions of both querying data and maintaining a solid database. In addition, I hope to assist and collaborate on creating an interactive UI on the front-end. This includes dynamic elements as well as consolidating on specific data input.
- 3 Strengths: Modern UI & UX, Database Management (SQL), Working with API’s
- 3 Weaknesses: Coding Documentation, Express, Automated Testing / Scripts

Michael - Frontend Developer
- Description: As a front end developer I intend to focus on the structuring, planning, designing and implementation of the user interface system of this Web App with the goal of minimizing errors, user complaints and downtime.
- 3 Strengths: Coding Documentation, Html/Css, Python 
- 3 Weaknesses: Javascript, React, Node.js


#### Q7: What operational events will you have as a team?

Describe meetings (and other events) you are planning to have. 
 * When and where? Recurring or ad hoc? In-person or online?
 * What's the purpose of each meeting?
 * Other events could be coding sessions, code reviews, quick weekly sync meeting online, etc.
 * You should have at least 2 meetings with your project partner (if you have one) before D1 is due. Describe them here:
   * What did you discuss during the meetings?
   * What were the outcomes of each meeting?
   * You must keep track of meeting minutes and add them to your repo.
   * You must have a regular meeting schedule established by the second meeting.  

The team is able to meet in-person on an almost daily basis, since our schedules are mostly compatible with each other. This will allow us to collaborate and share ideas with each other frequently and answer questions as they come up. We will also schedule two formal meetings each week (Scrum format) that we prepare for and take notes during. These will take place during the Monday tutorial and on Thursday evenings. Pair programming will be done whenever possible.
  
#### Q8: What artifacts will you use to self-organize?

List/describe the artifacts you will produce in order to organize your team.       

 * Artifacts can be To-Do lists, Task boards, schedule(s), meeting minutes, etc.
 * We want to understand:
   * How do you keep track of what needs to get done?
   * **How do you prioritize tasks?**
   * How do tasks get assigned to team members?
   * How do you determine the status of work from inception to completion?

JIRA will be used to keep track of stories and track progress on tasks and which ones have already been completed. Tasks are prioritized by team decision and the tasks will be listed in order of importance on JIRA. On JIRA, tasks are assigned to individual team members who are available to complete each task; this will be determined through team discussions in each meeting. Additionally, during meetings, we will be keeping meeting minutes, which will be general notes based on everyone’s progress and issues we need to work on. We will also keep a to-do list containing things that we must accomplish that may not correspond to an entire story. Discord is used for all asynchronous, online communications, and the server will host all our other artifacts and important resources.

#### Q9: What are the rules regarding how your team works?

Describe your team's working culture.

**Communications:**
 * What is the expected frequency? What methods/channels are appropriate? 
 * If you have a partner project, what is your process (in detail) for communicating with your partner?
 
**Meetings:**
 * How are people held accountable for attending meetings, completing action items? Is there a moderator or process?

People will be held accountable through JIRA tasks. Every task will have rough deadlines and will be assigned to members of the group. We will have discussions with any members that are falling behind and discuss alternatives for getting the work done. We will communicate frequently through Discord (our version of Slack), and also during daily ad-hoc meetings and two Scrum meetings. The Discord server contains channels so that subteams (frontend and backend) can communicate separately, but everyone else can still be kept in the loop.

----
## Highlights

Specify 3 - 5 key decisions and/or insights that came up during your meetings
and/or collaborative process.

 * Short (5 min' read max)
 * Decisions can be related to the product and/or the team process.
    * Mention which alternatives you were considering.
    * Present the arguments for each alternative.
    * Explain why the option you decided on makes the most sense for your team/product/users.
 * Essentially, we want to understand how (and why) you ended up with your current product and process plan.
 * This section is useful for important information regarding your decision making process that may not necessarily fit in other sections. 

 One of the first major points of discussion that came up in our design meetings was whether to make the application adhere to a for-profit or non-profit business model. More than for the potential of generating income for ourselves, the choice of making the app for-profit was driven by the fact that it may serve as an incentive for grocery and convenience stores to use our product. They could sell their goods for a reduced price and cut overall losses, and we would take a small portion of the proceeds. However, we ultimately decided against this, as there are existing products that help these stores and restaurants sell their expiring stock, and we wanted to deliver a product that will cater to as many individuals in need as possible, which we believe is done best through the donation of food at no cost.

An additional roadblock we faced was regarding the set of clients we should be catering to. We were initially thinking of only catering to food banks alone, as they could accept food donations in bulk and mobilize them very quickly. However, we considered this to be limiting the potential impact of our product, because we progressively thought of more and more kinds of individual consumers that would benefit from our product. Truly anyone could make use of our product to help reduce waste at a local level, but it will really help individuals who are struggling financially to meet their basic nutritional needs. 

The final major aspect of the product that underwent plenty of changes and required a lot of careful thought was the tech stack it would be built upon. Initially, we were planning on creating a mobile app for both the stores and the consumers to use. However, the technical knowledge of the team only included web technologies (e.g., Node, Spring Boot, JavaScript, etc.) which prompted us to consider making a web application instead. Beyond that, the more we considered a web application, we began to feel that it would be far more accessible to the general public than a mobile app, and it would be easier for stores to integrate it with their existing electronic inventory tracking systems, prompting us to commit to a web application. Regarding the technologies and frameworks to use in building the app, we considered certain solutions like Python and Django, but ultimately settled on using JavaScript and Node in the backend. We were always planning to use React in the frontend, so we felt that development would be much smoother if we were to use one language for the entire project.

