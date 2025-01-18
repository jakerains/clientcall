<page>
  <title>Enterprise rate limits - Bland AI</title>
  <url>https://docs.bland.ai</url>
  <content>By default, Bland customers can dispatch 1000 calls/day before hitting rate limits.

Enterprise customers start at 20,000 calls per hour, and 100,000 calls per day.

To raise your rate limits or discuss limits larger than what’s offered on enterprise, reach out [here](https://forms.default.com/361589).</content>
</page>

<page>
  <title>Enterprise rate limits - Bland AI</title>
  <url>https://docs.bland.ai/enterprise-features/enterprise-rate-limits</url>
  <content>By default, Bland customers can dispatch 1000 calls/day before hitting rate limits.

Enterprise customers start at 20,000 calls per hour, and 100,000 calls per day.

To raise your rate limits or discuss limits larger than what’s offered on enterprise, reach out [here](https://forms.default.com/361589).</content>
</page>

<page>
  <title>Send Call using Pathways (Simple) - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/calls-simple-pathway</url>
  <content>Your API key for authentication.

### Body

The phone number to call. Country code defaults to `+1` (US) if not specified.

Formatting is flexible, however for the most predictable results use the [E.164](https://www.twilio.com/docs/glossary/what-e164#examples-of-e164-numbers) format.

Follows the conversational pathway you created to guide the conversation.

You can access your pathway\_id by clicking on the ‘Copy ID’ button on your pathways [here](https://app.bland.ai/home?page=convo-pathways). If you don’t have any pathways, click the ‘Create Pathway’ button to create one!

### Response

A unique identifier for the call (present only if status is `success`).</content>
</page>

<page>
  <title>Custom Tools - Bland AI</title>
  <url>https://docs.bland.ai/tutorials/custom-tools</url>
  <content>Introduction
------------

Custom tools allow your agent to interact with any web API mid-call. Do things like:

Background
----------

To understand how custom tools work, let’s take a peek under the hood of the Bland AI phone agent.

During the conversation, the phone agent is constantly listening to figure out when it’s supposed to respond. When the phone agent realizes it’s time to respond, it reviews the tools in its toolbox and picks between them.

Those tools include a `speak`, `wait`, and `button press` tool. When you create a custom tool, you add it to the existing ‘toolbox’ for the phone agent to pick from.

A few natural questions arise:

1.  How do I define my custom tool?
2.  How do I make sure my tool gets picked at the right time?
3.  How does information from the call get passed to my custom tool’s API request?
4.  How do I fill the silence (when my custom tool is running)?
5.  How does the response from my custom tool get added to the call?

Keep reading to find out.

Creating your custom tool
-------------------------

The next step is to convert the API request into a custom tool. Custom tools have the following properties:

*   `name` - the agent will see this in the list of tools
*   `description` - a short explanation of what the tool does
*   `input_schema` - a JSON schema describing the input data
*   `speech` (optional) - a string that will be spoken to the agent while your tool waits for a response
*   `response_data` - An array of objects that describe how to extract data from the response. Within the response data, you can create variables that the phone agent can reference in its prompt.

### Name & Description

The agent will see the name in the list of tools. The name, plus the description, help the AI phone agent when it decides which tool to use.

For this example we’ll set the name to `BookAppointment` and the description to `Books an appointment for the customer`.

### Input Schema

The input schema is critical. It defines the shape of the API request, the different inputs the request can take, and also includes an example (which helps our system when creating requests).

Here’s what the input schema could look like:

Two important notes about input schema:

1.  `input_schema` is converted into the variable `"{{input}}"` that you can use in the request body/query/headers
2.  To access nested properties, use dot notation: `"{{input.property.subproperty}}"`
    *   For example, later on you could use `"{{input.service}}"` to have whatever type of appointment that the customer wants

What you’re doing here is describing the structure of the variables that the agent will create.

Special Note: If you need to gather detailed letter-by-letter information from the user, raise your `interruption_threshold` parameter to about `200` so that the AI doesn’t interject so quickly.

Scroll down to see the full example.

### Speech

Because requesting external APIs might take a while, we enable you to define a `speech` property. The phone agent will say the `speech` while it makes the request.

An example speech might look like: `Perfect, I'll schedule that right now, give me just a second.`

For the restaurant ordering example, the speech could be `Thank you, placing that order now.`

### Response data

Once your API request comes back, you need to extract the response data, and then make the phone agent aware of the new information.

The `data` field determines how you extract the data while the `name` field determines the variable name for reference in the prompt.

Here’s an example response data:

Full example
------------

Below is the entire API request for sending a phone call using the outlined custom tool:

Frequently asked questions
--------------------------

If you have any additional questions, reach out at [hello@bland.ai](mailto:hello@bland.ai) and one of our engineers will help.</content>
</page>

<page>
  <title>Twilio Studio Flow Integration - Bland AI</title>
  <url>https://docs.bland.ai/enterprise-features/studio-flow-integration</url>
  <content>Overview
--------

Enterprise customers can integrate Bland within their existing Twilio Studio Flows, allowing seamless transitioning in and out of existing telephony infrastructure.

Pre-requisites:

*   Your own Twilio account
*   An Existing Twilio Studio Flow hooked up to a Twilio phone number
*   A Bland Pathway

Step 1: Bland Twilio Setup
--------------------------

1.  Create an `encrypted_key` on the same Twilio account that your Studio Flow is hooked up to using the “BYOT” page in the [Dev Portal](https://app.bland.ai/dashboard/add-ons).
2.  Import the phone-number(s) that the Studio Flow is hooked up to through.

Step 2: Twilio Studio Flow Setup
--------------------------------

1.  Add a “twiml-redirect” widget to the flow where you want to transition to Bland.
2.  Name this widget EXACTLY “bland\_widget”.
3.  Change the url field to the following: `https://us.api.bland.ai/incoming?encrypted_key=YOUR_ENCRYPTED_KEY&param=YOUR_PARAM`

*   You MUST add the encrypted key associated with step 2. Any additional parameters will be populated as variables in the Bland Pathway.

This will transition the call to Bland from a studio flow. To transition out of Bland, you’ll need to add a “Twilio Studio Flow” node within the Bland Pathway.

Step 3: Transitioning out of Bland back to Studio Flow (optional)
-----------------------------------------------------------------

1.  Add a “Twilio Studio Flow” node where you’d like to transition out of Bland.
2.  Follow the instructons in the studio flow node to complete the full setup.</content>
</page>

<page>
  <title>Webhooks - Bland AI</title>
  <url>https://docs.bland.ai/tutorials/webhooks</url>
  <content>Introduction
------------

This is a quick tutorial to help you set up and test your Bland AI webhook. We’ll include instructions both for inbound and outbound phone calls.

We’ll start with inbound because it’s more popular.

Step 1: Create your webhook
---------------------------

To create a test webhook visit [Webhook.site](https://webhook.site/)

The website will automatically provide you a unique webhook URL.

Step 2: Connect to your inbound phone number
--------------------------------------------

Open your [developer portal](https://app.bland.ai/) and visit the [inbound phone numbers](https://app.bland.ai/home?page=inbound-number) page.

Paste your webhook into the `webhook` field. Make sure to remove the initial `https://` when you insert the URL. Then click `test webhook`.

Step 3: Verifying your outputs
------------------------------

Navigate to webhook.site page, and check if the test webhook fired correctly. You’ll know it worked because a new record will populate.

At this point, if your record fails to populate, double check that you provided the correct URL - and that you REMOVED the initial `https://` from it.

Otherwise, if issues persist, jump into the [discord](https://discord.gg/QvxDz8zcKe) - one of our teammates will help you asap.

Step 4: test a live phone call
------------------------------

Call your inbound phone number. Once it ends, visit the Webhook site and confirm once again that a new record populated.

If that’s working, then you’re set!

Step 5: Testing for outbound calls
----------------------------------

To test for outbound calls, once again create your webhook by referring back to step 1.

Then, follow the [send phone call docs](https://docs.bland.ai/api-v1/post/calls) to create and send a phone call. Make sure you include the `webhook` as a parameter in your request. After, confirm that the webhook data populated on your webhook site page.

And again, if you encounter issues, jump into [discord](https://discord.gg/QvxDz8zcKe) and message us - we will help asap.</content>
</page>

<page>
  <title>Webhook Signing - Bland AI</title>
  <url>https://docs.bland.ai/tutorials/webhook-signing</url>
  <content>Bland webhooks are signed with a secret key to ensure that they are not tampered with in transit and to confirm that they were sent by Bland.

Signing Webhooks
----------------

When Bland sends a webhook, it calculates a signature using the HMAC algorithm with the SHA-256 hash function. The signature is then included in the `X-Webhook-Signature` header of the request.

To create a webhook signing secret, first go to the [Account Settings in the Dev Portal](https://app.bland.ai/dashboard?page=settings) and click on the “Keys” tab.

Here you can create a new secret by clicking “Replace Secret”. It will only be shown once, so save it securely.

Verifying Webhooks
------------------

To verify a webhook, you need to calculate the HMAC signature of the request body using the secret key and compare it to the signature in the `X-Webhook-Signature` header.

Note that you must first create a webhook signing secret in the [Account Settings in the Dev Portal](https://app.bland.ai/dashboard?page=settings).

Here is an example of how to verify a webhook in Node.js:</content>
</page>

<page>
  <title>Send your first phone call - Bland AI</title>
  <url>https://docs.bland.ai/tutorials/send-first-call</url>
  <content>Before making a call, you need to authenticate your request. Make sure you have your API key ready.

Sign up on the [developer portal](https://app.bland.ai/) to get yours.

Step 2: Prepare the Call Data
-----------------------------

You will need to provide specific details for the call. These include:

*   `phone_number`: The number you want to call. Remember to include the country code.
*   `task`: Describe the purpose of the call and how the AI should handle the conversation.
*   `voice_id`: Choose the voice persona (American male, Australian female, etc.) based on your preference.
*   Set parameters like `reduce_latency`, `record`, `amd` (for navigating phone trees), and `wait_for_greeting` according to your call’s requirements.

Step 3: Customize the Call
--------------------------

You can further personalize the call by:

1.  Setting a `first_sentence` for the call.
2.  Specifying `dynamic_data` to incorporate external API data.
3.  Adjusting `voice_settings` for stability, similarity, and speed.
4.  Choosing the language with the `language` parameter.
5.  Setting a `max_duration` for the call.

Step 4: Send the API Request
----------------------------

Use the provided JavaScript or Python code snippet to make the API request.

Step 5: Handle the Response
---------------------------

After the call, you will receive a response with the `status` and `call_id`. If you set `record` to true, you can retrieve the recording using the `/call/recording` endpoint.

Here’s what an example response might look like:

Step 6: Monitor the Call
------------------------

If you have set up a webhook, you will receive real-time notifications and transcripts once the call completes.

And that’s it! You’re now ready to make your first AI-powered phone call with Bland AI. Happy calling!</content>
</page>

<page>
  <title>Send Call With Task (Simple) - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/calls-simple</url>
  <content>Send an AI phone call using a task.

### Headers

### Body

The phone number to call. Must be a valid phone number in [E.164](https://en.wikipedia.org/wiki/E.164) format.

The task to use for the call. This is a prompt that tells the AI background information, expected behavior, and relevant information.

### Response

A unique identifier for the call (present only if status is `success`).</content>
</page>

<page>
  <title>Conversational Pathways - Bland AI</title>
  <url>https://docs.bland.ai/tutorials/pathways</url>
  <content>[Template Pathway Video Tutorial](https://www.loom.com/share/be9d6f1072ae4267abc0717e36e66078?sid=82a7843f-9e7c-457a-8f7b-4d8ca026e1ff)

Introduction
------------

Conversational pathways are our new way of prompting Bland that has led to major breakthroughs in realism.

Terminologies
-------------

To understand how pathways work, let’s first understand the terminologies.

Nodes
-----

These blocks you see here are called Nodes.

Each of these dotted lines is called a Pathway. Their start end end points are the `Purple Circles` on the top and bottom of the nodes.

In order to create a pathway from a node, you would click on the purple circle at the bottom of the node and drag your mouse to connect to the top purple circle another node.

Upon doing so, you will now have a new dotted line connecting the two nodes, with a ‘New Pathway’ button in the middle of the line.

In order to instruct the agent when to take this pathway, you would click on the Edit icon on the ‘New Pathway’ button, and input the conditions for when the agent should take this pathway. In the above example, the agent would take this pathway if the user is not available to talk, so I labelled the pathway as ‘not a good time to talk’.

And there you have it! You have now created a pathway from one node to another, and instructed the agent when to take this pathway. You can connect as many nodes as you want in this manner, and create as many pathways as you want. In order to create a new Node, press the ‘Add new Node’ button at the top-left of the screen.

How the Pathways Agent Works
----------------------------

The agent starts at the first node, and then moves to the next node based on the pathway that the agent decides to take. The agent will then execute the instructions in the node as dialogue, and then move on to the next node based on the pathway that the agent decides to take. This process will continue until the agent decides to end the call.

The agent will make decisions based on the labels you put in the pathways, when connecting one node to another, and the dialogue generated will be based on the instructions you set in the nodes.

For Example,

In this example, at the node named ‘Ask for reservation info’, the node asks for the user’s reservation information. Based on the user’s response, the agent will then move on to the next node based on the labels you put in the pathways. For the current node, it will check if the user has provided reservation information where the number of guests is either less than 8 or more than 8. If the user has provided reservation information where the number of guests is less than 8, the agent will move on to the node named ‘Reservation booking’. If the user has provided reservation information where the number of guests is more than 8, the agent will move on to the node named ‘Transfer Call’. The agent will then execute the instructions in the node as dialogue, and then move on to the next node based on the pathway that the agent decides to take. And the process repeats!

Conditions
----------

Conditions are a way to provide the agent with a condition that must be met in order for the agent to move on to the next node. If the condition is not met, the agent will stay on the same node and ensure the condition is met until the condition is fulfilled.

Using the same example above, I set the condition for the ‘Ask for reservation info’ node as follows - “You must get the date, time, and number of guests for this reservation”. This means that the agent will stay on the ‘Ask for reservation info’ node until the user provides the date, time, and number of guests for the reservation. If the user says something else or deviates from the conversation, the agent will stay on the ‘Ask for reservation info’ node and prompt the user to provide the date, time, and number of guests for the reservation.

This helps you to ensure that the user provides the necessary information before moving on to the next node, and helps you to control the flow of the conversation.

Global Nodes
------------

Global Nodes take precendence over the condition decisions made by the agent. You can treat a global node as a node, that every other node in the pathway has a pathway to, with the label as the ‘Global Pathway Label’.

Using the Reservation Booking Example, if the user were to ask a question like ‘What are the opening hours of the restaurant’ when the agent is at the ‘Ask for reservation info’ node, the condition decision would not be met as the user did not provide the date, time, and number of guests for the reservation. However, the pathway label would be ‘user has a question about the restaurant’s hours or location’, which links to a Global Node. As Global Nodes take precedence over the condition decision, the agent would then move to the ‘Global Node’ named ‘Restaurant Questions’ and provide the user with the opening hours of the restaurant. After providing the user with the opening hours of the restaurant, the agent would then automatically return to the ‘Ask for reservation info’ node, and continue with the flow of the conversation.

This helps you to handle edge cases where the user might ask a question that is not related to the current conversation, and allows you to provide the user with the information they need, before returning to the conversation.

Tip: The variables `{{lastUserMessage}}` and `{{prevNodePrompt}}` can be used in the Global Node to provide the agent with context on what the user said, and steering the conversation back to its own original goal.

Node Types
----------

There are currently 6 different types of Nodes

*   Default
*   Webhook
*   Knowledge Base
*   End Call
*   Transfer Call
*   Wait for Response

You can select the type of node you want by clicking on the dropdown of `Node Type`.

Base/Default Node (Important!)
------------------------------

The default node provides the ability to generate a response to the user. This functionality is exposed to all other nodes as well.

You can either:

*   Use the `Prompt` field to give instructions on what the agent should do at this point in the conversation. This is the recommended way to generate responses as it makes the conversation more human and natural.
*   Enable the ‘Static Text’ toggle to provide a fixed response, and the agent will always say the same thing at this point in the conversation.

### Optional Decision Guide

The optional decision guide is only to be used if your phone agent currently is not going down the correct pathway. We do not expect this to happen often, but still want to provide you the tools to handle these issues if they arise.

It is a way to provide the phone agent with example scenarios of what the user might say, and what pathway the agent should take in response.

You would put in examples of what the user might say in the `User Input` field, and then in the `Pathway` field, you would provide the pathway the agent should take in response.

### Condition

The condition is a way to provide the agent with a condition that must be met in order for the agent to move on to the next node. If the condition is not met, the agent will stay on the same node and ensure the condition is met until the condition is fulfilled.

### Global Nodes

Each node can be configured to be a Global Node. Global Nodes are nodes that are accessible by every other node in the Conversational Pathway. This means that it has an implicit pathway to every other node, and the label would be the ‘Global Label’.

After entering a Global Node, the agent will execute the instructions inside the Global Node, and then automatically return to the node it was at before entering the Global Node, so it can continue with the flow of the conversation.

In a Global Node, you can also forward the agent to another node, by toggling the ‘Enable Forwarding’, which will allow you to select the node you want to move the agent to. This is useful if you want to move the agent to a existing node for a certain scenario, which could happen at any point in the conversation.

Transfer Call Node
------------------

The transfer call node is used to transfer the call to another number when the node is reached, and the dialogue at this node is complete.

As such, you may have the agent say any final words before the call is transferred.

End Call Node
-------------

The end call node will end the call when the node is reached, and the dialogue at this node is complete.

As such, you may have the agent say any final words before the call is ended.

Knowledge Base Node
-------------------

The knowledge base node is used to connect your agent to a knowledge base, to answer any questions the user has.

Paste in any text in the ‘Knowledge Base’ field, and the agent will search through the knowledge base to answer the user.

Coming soon - PDF Upload/Vector Database Integrations…

Wait for Response Node
----------------------

The Wait for Response Node works the same way as the Default Node, except it is also equipped with the ability to wait if the user requires time to respond or needs to hold for a moment.

Webhook Node
------------

The webhook node is used to execute webhooks at any point during the conversation, and send speech during/after the webhook.

`Webhook Information` is all you need in order to execute a webhook, and works the same way as Dynamic Data. Refer to the [Dynamic Data](https://docs.bland.ai/tutorials/dynamic-data) section for more information…

Similar to how the dialogue is handled in all other nodes, you can control the dialogue sent before, and after the webhook is executed.

Variables received from the webhook can be used in the dialogue as well, as shown in the example below.

Global Prompt for all Nodes
---------------------------

The ‘Add Global Prompt to All Nodes’ feature is to assist in providing context/instructions to the agent for all nodes, without having to manually input the same prompt for each node. One Example of a Global Prompt could be to provide the agent with instructions on how to handle the call, the tone of voice to use, or answering any questions the user might have.

Live Call Logs
--------------

The live call logs are a way to provide you with a live feed of the conversation between the agent and the user. This is useful for debugging purposes, and to see how the agent is responding to the user in real-time and the decisions the agent is making. On top of the transcript, we expose the updated node the agent took, the pathway that the agent took, as well as whether the condition was met or not.

Testing the Pathway Agent via Chat
----------------------------------

You can test the responses from your pathway agent by clicking on the ‘Chat with Pathway’ button at the top right of the screen. This will open a chat window where you can test the agent by sending messages to the agent, and see how the agent responds. The live call logs will also be displayed on the right side of the screen, so you can see the decisions the agent is making in real-time.

Variables
---------

You can reference variables in pathways using double curly braces like `{{first_name}}`. You can pass variables into your call by passing in the key-value pairs in the `request_data` field when sending a call.

Some examples of variables that you can access at each node:

*   `{{lastUserMessage}}` - The last response from the user
*   `{{prevNodePrompt}}` - The prompt from the previous node
*   `{{now_utc}}` - The current time in UTC
*   `{{from}}` - The phone number the call is from
*   `{{to}}` - The phone number the call is to
*   `{{call_id}}` - The unique identifier for the call

At each node, you can also extract variables from the user’s response using the `Extract Variables from Call Info` field. You would put in the name of the variable you want to extract, the type of the variable (integer, string, boolean), and the description for what information you want the variable to store. You can also provide specific formats you expect and examples in the description. The more descriptive it is, the better the agent will be at extracting the variable more accurately.

Do note that when enable variable extraction, and wanting to reference the variable in the subsequent nodes, it would introduce slight latency as the agent would have to extract the variable from the user’s response before generating the dialogue for the next node.

Within the webhook node, the variable extraction happens before the webhook is executed, so that you can reference the variables extracted from the user’s response in the webhook’s request data. The variables extracted from the webhook in `response_data` can also be referenced in the dialogue generated after the webhook is executed, in the same manner.

For Example, the image below shows how the Webhook Node is set up to extract the date, time, and number of guests for the reservation, and how the extracted variables are referenced in the webhook’s request data.

Fine Tuning the Pathway agent
-----------------------------

While Conversational Pathways gives you a lot greater control compared to the regular call agent, hallucinations can still occur, or the agent might make wrong decisions in the pathway. However, we have provided you with the tools to handle these issues if they arise. Each node can be fine-tuned on the decision it makes, as well as the expected dialogue it generates, allowing you to handle even the most extreme edge cases that might arise easily.

### Steps to Fine-Tuning the agent

Upon triggering and testing a call with your pathway using the ‘Chat with Pathway’ button, or sending a call, you will be able to see the live call logs.

If you see a decision that the agent made that you do not agree with, or if the agent is hallucinating, you can fine-tune the decision the agent makes by clicking on the `Edit` button on the `PATHWAY DECISION INFO` block.

Upon doing so, you will be able to see the decisions the agent made for the condition, the pathway it took, and the dialogue it generated. You can then fine-tune the agent by changing the dialogue, the condition, or the pathway the agent took.

Upon saving your changes, you will be able to see the fine-tuning data in the node where the decision was made. This training data is used to train the agent to make better decisions in the future, and to ensure that the agent does not make the same mistake again.

Do note that the decisions for the condition and pathway chosen is made by the node the agent is currently at, and the dialogue is generated by the node which the agent decides to take the pathway to.

For Example, If the agent is at Node 1, and the agent decides that the condition is achieved, and decides to take the pathway to Node 2, the dialogue generated will be from Node 2, and the decisions for the condition and pathway chosen will be from Node 1. As such, the training data for the condition and pathway chosen will be stored in Node 1, and amendments to the dialogue generated will be stored in Node 2.

Quick Start with Tutorial / Templates
-------------------------------------

To immediately start playing around with Conversational Pathways, you can use one of our templates. Visit the Conversational Pathways page on our Dev Portal, and duplicate the ‘Restaurant Reservation’ Template, and run through the agent to see how it works! We have also created a video walkthrough of that template to help you get started!

[Video Walkthrough/Tutorial](https://www.loom.com/share/be9d6f1072ae4267abc0717e36e66078?sid=82a7843f-9e7c-457a-8f7b-4d8ca026e1ff)

Create a pathway now! Click [here](https://app.bland.ai/dashboard?page=convo-pathways) to get started!

If you have any additional questions, reach out on our [Discord](https://discord.gg/QvxDz8zcKe) and one of our engineers will help.</content>
</page>

<page>
  <title>Send 1000 phone calls - Bland AI</title>
  <url>https://docs.bland.ai/tutorials/send-1000-calls-at-once</url>
  <content>To initiate a batch call, you must first authenticate your request. Ensure you have your API key from signing up on the [developer portal](https://app.bland.ai/).

Step 2: Create the Base Prompt
------------------------------

Craft a base prompt that will be common across all calls in the batch. Use placeholders `{{curly braces}}` for dynamic content.

Example:

Step 3: Define the Call Data
----------------------------

Specify the list of calls in the `call_data` array. Each call must have a `phone_number` and can include other properties corresponding to placeholders in your base prompt.

Example:

Step 4: Additional Configuration
--------------------------------

*   `label`: Assign a label to your batch for easy tracking.
*   `campaign_id`: Organize related batches under a campaign.
*   `test_mode`: Set to true for testing with the first call only.
*   `batch_id`: Manually set or auto-generated for tracking.
*   Voice and Language Settings: Select `voice_id`, `reduce_latency`, and `language`.
*   `request_data`: Include specific facts for the AI to know during the call.
*   `webook`: For real-time notifications and transcripts post-call.
*   `max_duration`: Define the maximum length of each call.
*   `amd`: Enable for navigating phone trees or leaving voicemails.
*   `wait_for_greeting`: Control if the AI speaks immediately or waits.

Step 5: Send the API Request
----------------------------

Use the provided JavaScript or Python code snippet to make the API request.

Step 6: Handle the Response
---------------------------

After sending the batch request, you’ll receive a response with a `message` and the `batch_id`. Monitor the progress of your calls and any responses via your specified webhook.

Here’s what an example response might look like:

Step 7: Monitoring and Analytics
--------------------------------

Track the performance and outcomes of your batch calls through the provided `batch_id` and campaign analytics. Adjust future batches based on the insights gained.</content>
</page>

<page>
  <title>Delete Pathway - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/delete_pathway</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

Conversational Pathways

Delete your conversational pathway.

DELETE

/

v1

/

pathway

/

{pathway\_id}

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-pathway-id)

pathway\_id

string

required

The unique identifier of the conversational pathway you want to delete.

### 

[​](#response)

Response

[​](#param-status)

status

string

Can be `success` or `error`.

[​](#param-pathway-id-1)

pathway\_id

string

A unique identifier for the pathway (present only if status is `success`).

[Update Pathway](https://docs.bland.ai/api-v1/post/update_pathways)[Create Pathway Chat](https://docs.bland.ai/api-v1/post/pathway-chat-create)</content>
</page>

<page>
  <title>Create Pathway - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/pathways</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

Conversational Pathways

Create a new conversational pathway

POST

/

v1

/

pathway

/

create

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#body)

Body

[​](#param-name)

name

string

required

The name of the conversational pathway you want to create

[​](#param-description)

description

string

A description of the conversational pathway you want to create

### 

[​](#response)

Response

[​](#param-status)

status

string

Can be `success` or `error`.

[​](#param-pathway-id)

pathway\_id

string

A unique identifier for the pathway (present only if status is `success`).

[Get Single Pathway Information](https://docs.bland.ai/api-v1/get/pathway)[Update Pathway](https://docs.bland.ai/api-v1/post/update_pathways)</content>
</page>

<page>
  <title>Stop All Active Calls - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/calls-active-stop</url>
  <content>End all active phone calls on your account.

### Headers

Your API key for authentication.

### Response

If the status is `success`, the message will say “Call ended successfully.” Otherwise, if the status is `error`, the message will say “SID not found for the given c\_id.” or “Internal server error.”

The number of active calls that will be cancelled.</content>
</page>

<page>
  <title>Event Stream - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/event-stream</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-call-id)

call\_id

string

required

The unique identifier of the call for which you want to retrieve detailed information.

### 

[​](#response)

Response

[​](#param-level)

level

string

The level of the event - `queue` or `call`

[​](#param-message)

message

string

The message of the event.

[​](#param-category)

category

string

The category of the event - `info`, `performance` or `error`.

[​](#param-call-id-1)

call\_id

string

The unique identifier for the call.

[​](#param-timestamp)

timestamp

string

When the event occurred.</content>
</page>

<page>
  <title>Stop Active Call - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/calls-id-stop</url>
  <content>End an active phone call by call\_id.

### Headers

Your API key for authentication.

### Path Parameters

The unique identifier for the call you want to end.

### Response

If the status is `success`, the message will say “Call ended successfully.” Otherwise, if the status is `error`, the message will say “SID not found for the given c\_id.” or “Internal server error.”</content>
</page>

<page>
  <title>Analyze Call with AI - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/calls-id-analyze</url>
  <content>Your API key for authentication.

### Path Parameters

The unique identifier for the call to be analyzed.

### Request Body

This is the overall purpose of the call. Provides context for the analysis to guide how the questions/transcripts are interpreted.

An array of questions to be analyzed for the call.

Each question should be an array with two elements: the question text and the expected answer type (e.g., “string”, “boolean”).

Fairly flexible in terms of the expected answer type, and unanswerable questions will default to `null`.

Examples:

### Response

Will be `success` if the request was successful.

Confirms the request was successful, or provides an error message if the request failed.

Contains the analyzed answers for the call in an array.

Token-based price for the analysis request.

As a rough estimate, the base cost is `0.003` credits with an additional `0.0015` credits per call in the call.

Longer call transcripts and higher numbers of questions can increase the cost, however the cost scales very effectively with calls vs. individual calls.</content>
</page>

<page>
  <title>Create a Knowledge Base - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/vectors</url>
  <content>Usage: Pass the `vector_id` into your agent’s `tools` to enable the agent to use the vector store.

Your API key for authentication.

### Body

The name of the knowledge base. Make this a clear name that describes the contents of the store.

A description of the knowledge base. This can be a longer description of the contents of the store, or what terms to use to search for vectors in the store.

This is visible to the AI, so making it descriptive can help the AI understand when to use it or not.

The full text document to be stored and vectorized.

### Response

The unique identifier for the knowledge base.

Will start with “KB-”.</content>
</page>

<page>
  <title>Audio Recording - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/calls-id-recording</url>
  <content>Your API key for authentication.

Must be `application/json` to receive a url, or `audio/mpeg` to receive the audio file.

### Path Parameters

The ID of the call to retrieve the recording for.

### Response

If the status is `success`, the `url` field will be present.

A 404 error will be returned if the call does not exist or the recording is not available. We can only retrieve recordings if the call was created with `record` set to `true`.

A 400/500 error will be returned if there is an error retrieving the recording.

If the status is `success`, the `url` will provide the exact location of the MP3 file storing the call’s audio.</content>
</page>

<page>
  <title>Analyze Call Emotions - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis</url>
  <content>Overview
--------

Use advanced AI to analyze the emotional content of a call recording and determine the dominant emotion expressed during the conversation. This intelligence endpoint processes audio recordings up to 25MB in size and returns the primary detected emotion along with analysis metadata.

* * *

Your API key for authentication.

Must be set to `application/json`.

* * *

### Body

The unique identifier of the call to analyze. This should be a call ID from a previous call made through the system.

* * *

### Response

The outer response wrapper.

The status of the analysis request. Will be “success” for successful analyses.

Object containing the analysis results.

The dominant emotion detected in the call. Can be one of: “neutral”, “happy”, “angry”, “sad”, or “fear”.

The ID of the analyzed call.

ISO timestamp indicating when the analysis was completed.

Will be null for successful requests. Contains error details when the request fails.

* * *

### Error Responses

*   **413 Payload Too Large**: Returned when the audio file exceeds the 25MB size limit
*   **404 Not Found**: Returned when the specified call\_id does not exist
*   **401 Unauthorized**: Returned when the API key is invalid or missing</content>
</page>

<page>
  <title>Update Pathway - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/update_pathways</url>
  <content>Update a conversational pathway’s fields - including name, description, nodes and edges.

### Headers

Your API key for authentication.

### Path Parameters

The unique identifier of the conversational pathway you want to update.

### Body

The name of the conversational pathway

A description of the pathway

Data about all the nodes in the pathway.

Example of a node object:

Data about all the edges in the pathway.

### Response

A unique identifier for the pathway (present only if status is `success`).

Data about all the nodes in the pathway.

Data about all the edges in the pathway.</content>
</page>

<page>
  <title>List Calls - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/calls</url>
  <content>Your API key for authentication.

Use your own Twilio account and only return inbound numbers associated with that account sid (optional).

### Query Parameters

Filter calls by the number they were dispatched from.

The number that initiated the call - the user’s phone number for inbound calls, or the number your AI Agent called from for outbound calls.

Filter calls by the number they were dispatched to.

The number that answered the call - the user’s phone number for outbound calls, or your AI Agent’s number for inbound calls.

The starting index (inclusive) for the range of calls to retrieve.

The ending index for the range of calls to retrieve.

The maximum number of calls to return in the response.

Whether to sort the calls in ascending order of their creation time.

Get calls including and after a specific date. Format: YYYY-MM-DD

Get calls including and before a specific date. Format: YYYY-MM-DD

Get calls for a specific date. Can’t be used with end\_date or start\_date. Format: YYYY-MM-DD

Whether to filter calls by complete status.

Get calls from a specific batch.

Filter by answered\_by type. Example: human

Whether to filter based on inbound or not.

Duration (Call Length) greater than the value provided. Example: 0.5 (This would be equal to half a minute)

Duration (Call Length) less than the value provided. Example: 0.5 (This would be equal to half a minute)

Get calls for a specific campaign id.

### Response

The total number of calls that match the query filters. This number may be greater than the number of calls returned in the response.

For example:

*   If you have 10,000 calls, and don’t include any filters, the `total_count` will be 10,000.
*   If you have 10,000 calls and 9,000 of them match the query, the `total_count` will be 9,000 regardless of the number of calls returned in the response.

The number of calls returned in the response.

An array of call data objects. See the [Call](https://docs.bland.ai/api-v1/get/calls-id) section for details.

Note: Individual call transcripts are not included due to their size.</content>
</page>

<page>
  <title>Send Call - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/calls</url>
  <content>Overview
--------

Send an AI phone call with a custom objective and actions. This endpoint can be used to create dynamic phone calls where the AI agent can follow instructions, use tools, and follow a conversation pathway.

* * *

Your API key for authentication.

A special key for using a BYOT (Bring Your Own Twilio) account. Only required for sending calls from your own Twilio account.

* * *

Body Parameters
---------------

The phone number to call. Must be a valid phone number in [E.164](https://en.wikipedia.org/wiki/E.164) format.

This is the pathway ID for the pathway you have created on our dev portal. You can access the ID of your pathways by clicking the ‘Copy ID’ button of your pathway [here](https://app.bland.ai/home?page=convo-pathways)

Note: Certain parameters do not apply when using pathways.

Example Simple Request body:

Note: Do not specify if using a pathway.

Provide instructions, relevant information, and examples of the ideal conversation flow.

This is your prompt where you are telling the agent what to do.

Recommendations:

*   Include context and a background/persona for the agent like `"You are {name}, a customer service agent at {company} calling {name} about {reason}`.
*   Phrase instructions like you are speaking to the agent before the call.
*   Any time you tell the agent not to do something, provide an example of what they should do instead.
*   Keep the prompt under 2,000 characters where possible.

The voice of the AI agent to use. Accepts any form of voice ID, including custom voice clones and voice presets.

Default voices can be referenced directly by their name instead of an id.

Usage example: voice: “maya”

Bland Curated voices:

*   Josh
*   Florian
*   Derek
*   June
*   Nat
*   Paige

Select an audio track that you’d like to play in the background during the call. The audio will play continuously when the agent isn’t speaking, and is incorporated into it’s speech as well.

Use this to provide a more natural, seamless, engaging experience for the conversation. We’ve found this creates a significantly smoother call experience by minimizing the stark differences between total silence and the agent’s speech.

Options:

*   null - Default, will play audible but quiet phone static.
*   office - Office-style soundscape. Includes faint typing, chatter, clicks, and other office sounds.
*   cafe - Cafe-like soundscape. Includes faint talking, clinking, and other cafe sounds.
*   restaurant - Similar to cafe, but more subtle.
*   none - Minimizes background noise

Makes your agent say a specific phrase or sentence for it’s first response.

By default, the agent starts talking as soon as the call connects.

When wait\_for\_greeting is set to true, the agent will wait for the call recipient to speak first before responding.

When set to `true`, the AI will not respond or process interruptions from the user.

Adjusts how patient the AI is when waiting for the user to finish speaking.

Lower values mean the AI will respond more quickly, while higher values mean the AI will wait longer before responding.

Recommended range: 50-200 • 50: Extremely quick, back and forth conversation • 100: Balanced to respond at a natural pace • 200: Very patient, allows for long pauses and interruptions. Ideal for collecting detailed information.

Try to start with 100 and make small adjustments in increments of ~10 as needed for your use case.

Select a model to use for your call.

Options: base, turbo and enhanced.

In nearly all cases, enhanced is the best choice.

A value between 0 and 1 that controls the randomness of the LLM. 0 will cause more deterministic outputs while 1 will cause more random.

Example Values: “0.9”, “0.3”, “0.5”

These words will be boosted in the transcription engine - recommended for proper nouns or words that are frequently mis-transcribed.

For example, if the word Blandy is frequently transcribed as a homonym like “Reese” you could do this:

For stronger keyword boosts, you can place a colon then a boost factor after the word. The default boost factor is 2.

The pronunciation guide is an `array` of `objects` that guides the agent on how to say specific words. This is great for situations with complicated terms or names.

A phone number that the agent can transfer to under specific conditions - such as being asked to speak to a human or supervisor. This option will be ignored for pathways.

Give your agent the ability to transfer calls to a set of phone numbers. This option will be ignored for pathways.

Overrides transfer\_phone\_number if a transfer\_list.default is specified.

Will default to transfer\_list.default, or the chosen phone number.

Example usage to route calls to different departments:

Select a supported language of your choice. Optimizes every part of our API for that language - transcription, speech, and other inner workings.

The version number of the pathway to use for the call. Defaults to the production version.

When `true`, automatically selects a “from” number that matches the callee’s area code for US-based calls. Must have purchased a local dialing add-on in the [add-ons section](https://app.bland.ai/dashboard/add-ons).

When `true`, if a voicemail is left, an SMS is also sent to the callee (requires SMS configuration).

Restricts calls to certain hours in your timezone. Specify the timezone and time windows using 24-hour format.

Supported time formats: • 24-hour: “13:00”, “09:30” • 12-hour: “1:00pm”, “9:30am” • Military: “1300”, “0930”

Example:

The times will be automatically converted to UTC for processing. If the end time is before the start time (e.g. “22:00” to “06:00”), it will be interpreted as spanning overnight.

sensitive\_voicemail\_detection

When `true`, uses LLM-based analysis to detect frequent voicemails.

Toggles noise filtering or suppression in the audio stream to filter out background noise.

When `true`, DTMF (digit) presses are ignored, disabling menu navigation or call transfers triggered by keypad input.

language\_detection\_period

After this many seconds have passed, the language detection will run and change the AI’s language configuration if it’s different from the initial setting.

Shorter periods make the language switch faster, while longer periods are more accurate.

Valid range: 10-100 seconds.

The current language at a given moment can be accessed via the {{language}} prompt variable in Pathways.

language\_detection\_options

If `language_detection_period` is set, this array can be used to narrow down the languages that the AI can switch to.

By default, these select languages can be detected (and switched to) at any time during the call:

Any values passed into language\_detection\_options must be from that same list.

Note: The supported languages and their mappings at any given moment can be accessed through [https://api.bland.ai/v1/languages](https://api.bland.ai/v1/languages).

timezone

default:

"America/Los\_Angeles"

Set the timezone for the call. Handled automatically for calls in the US.

This helps significantly with use cases that rely on appointment setting, scheduling, or behaving differently based on the time of day.

Timezone options are here in the TZ identifier column.

Request data fields are available to the AI agent during the call when referenced in the associated pathway or task. For example, let’s say in your app you want to programmatically set the name of the person you’re calling. You could set `request_data` to:

Interact with the real world through API calls.

Detailed tutorial here: [Custom Tools](https://docs.bland.ai/tutorials/custom-tools#custom-tools)

The time you want the call to start. If you don’t specify a time (or the time is in the past), the call will send immediately.

Set your time in the format YYYY-MM-DD HH:MM:SS -HH:MM (ex. 2021-01-01 12:00:00 -05:00).

The timezone is optional, and defaults to UTC if not specified.

Note: Scheduled calls can be cancelled with the POST /v1/calls/:call\_id/stop endpoint.

When the AI encounters a voicemail, it will leave this message after the beep and then immediately end the call.

Warning: If amd is set to true or voicemail\_action is set to ignore, then this will still work for voicemails, but it will not hang up for IVR systems.

This is processed separately from the AI’s decision making, and overrides it.

Options: • hangup • leave\_message • ignore

Examples: • Call is answered by a voicemail (specifically with a beep or tone): • If voicemail\_message is set, that message will be left and then the call will end. • Otherwise, the call immediately ends (regardless of amd) • Call is answered by an IVR system or phone tree: • If amd is set to true, the AI will navigate the system and continue as normal. • If voicemail\_action is set to ignore, the AI will ignore the IVR and continue as normal. • Otherwise, if voicemail\_message is set then it’ll leave that message and end the call. • Finally, if none of those conditions are met, the call will end immediately.

Note: If voicemail\_message is set, then the AI will leave the message regardless of the voicemail\_action.

If the call goes to voicemail, you can set up the call to retry, after a configurable delay. You can also update the voicemail\_action, and voicemail\_message in the retry object, for the re-tried call.

Takes in the following parameters:

*   `wait` (integer): The delay in seconds before the call is retried.
*   `voicemail_action` (enum): The action to take when the call goes to voicemail. Options: `hangup`, `leave_message`, `ignore`.
*   `voicemail_message` (string): The message to leave when the call goes to voicemail.

Example:

When the call starts, a timer is set for the `max_duration` minutes. At the end of that timer, if the call is still active it will be automatically ended.

Example Values: 20, 2

To record your phone call, set `record` to true. When your call completes, you can access through the `recording_url` field in the call details or your webhook.

Specify a phone number to call from that you own or have uploaded from your Twilio account. Country code is required, spaces or parentheses must be excluded.

By default, calls are initiated from a separate pool of numbers owned by Bland. If you are using your own twilio numbers, you must specify a matching encryped\_key in the create call request headers.

When the call ends, call information is sent to this webhook URL.

Specify which events you want to stream to the webhook, during the call.

Options:

*   `queue`
*   `call`
*   `latency`
*   `webhook`
*   `tool`
*   `dynamic_data`

Example Payload:

Add any additional information you want to associate with the call. This can be used to track calls or add custom data to the call.

Anything that you put here will be returned in the post call webhook under metadata.

Example:

The analysis preset UUID used to analyze the call, must be created on the [analysis presets page](https://app.bland.ai/dashboard/analytics?tab=analysis_presets).

All fields in the preset configuration are filled at the end of the call by analyzing the transcript.

Example:

A unique identifier for the call (present only if status is `success`).

The batch ID of the call (present only if status is `success`).

A message explaining the status of the call.

For validation errors, a detailed list of each field with an error and it’s error message.

Example:</content>
</page>

<page>
  <title>Get All Pathways Information - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/all_pathway</url>
  <content>### Headers

Your API key for authentication.

### Response

The name of the conversational pathway.

A description of the conversational pathway.

Data about all the nodes in the pathway.

Examples of JSON objects for nodes (Horizontal scroll the tab bar to see more examples)

*   `name` — name of the node
*   `isStart` — whether the node is the start node. There can only be 1 start node in a pathway. Either `true` or `false`.
*   `isGlobal` — whether the node is a global node. Global nodes are nodes that can be used in multiple pathways. Either `true` or `false`.
*   `globalLabel` — the label of the global node. Should be present if `isGlobal` is true.
*   `type` — Type of the node. Can be `Default`, `End Call`, `Transfer Node`, `Knowledge Base`, or `Webhook`.
*   `text` — If static text is chosen, this is the text that will be said to the user.
*   `prompt` — If dynamic text is chosen, this is the prompt that will be shown to the user.
*   `condition` — The condition that needs to be met to proceed from this node.
*   `transferNumber`
    *   If the node is a transfer node, this is the number to which the call will be transferred.
*   `kb`
    *   If the node is a knowledge base node, this is the knowledge base that will be used.
*   `pathwayExamples`
    *   The fine-tuning examples for the agent at this node for the pathways chosen
*   `conditionExamples`
    *   The fine-tuning examples for the condition at this node for the condition chosen
*   `dialogueExamples`
    *   The fine-tuning examples for the dialogue at this node for the dialogue chosen.
*   `modelOptions`
    *   `interruptionThreshold` — The sensitivity to interruptions at this node
    *   `temperature` — The temperature of the model.
*   `extractVars`
    *   An array of array of strings. \[\[`varName`, `varType`, `varDescription`\]\] e.g `[["name", "string", "The name of the user"], ["age", "integer", "The age of the user"]]`

Data about all the edges in the pathway.

*   `id` — unique id of the edge
*   `source` — id of the source node
*   `target` — id of the target node
*   `label` — Label for this edge. This is what the agent will use to decide which path to take.</content>
</page>

<page>
  <title>Purchase Phone Number - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/inbound-purchase</url>
  <content>Your API key for authentication.

### Body

Choose a three-digit area code for your phone number. If set as a parameter, a number will only be purchased by exact match if available.

Choose a country code for your phone number.

Options: `"US"` or `"CA"` for Canada. For others, please contact support.

Specify an exact phone number you’d like to use. If provided, will override the `area_code` parameter and does not fall back to any other number.

Example of the correct format (Note the `"+1"` is mandatory): `"+12223334444"`</content>
</page>

<page>
  <title>Upload Text - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/upload-text</url>
  <content>Upload text files along with optional metadata like name and description.

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#body)

Body

[​](#param-file)

file

file

required

The text file to be uploaded. Must be a .pdf, .txt, .doc, or .docx file.

[​](#param-name)

name

string

Name for the uploaded text file

[​](#param-description)

description

string

Description for the uploaded text file</content>
</page>

<page>
  <title>Upload Media - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/upload-media</url>
  <content>Upload media files along with optional metadata like name and description.

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#body)

Body

[​](#param-file)

file

file

required

The media file to be uploaded. Must be an .mp3 or .mp4 file.

[​](#param-name)

name

string

Name for the uploaded media file

[​](#param-description)

description

string

Description for the uploaded media file</content>
</page>

<page>
  <title>List Knowledge Bases - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/vectors</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#query-parameters)

Query Parameters

[​](#param-include-text)

include\_text

boolean

default:

false

Include the full text of the documents stored in the knowledge base. This can be useful for debugging, but may return large amounts of data.

### 

[​](#response)

Response

[​](#param-vectors)

vectors

array

An array of objects, for each knowledge base in your account.

[​](#param-vectors-vector-id)

vectors\[\].vector\_id

string

The unique identifier for the knowledge base.

[​](#param-vectors-name)

vectors\[\].name

string

The name of the knowledge base.

[​](#param-vectors-description)

vectors\[\].description

string

A description of the knowledge base.</content>
</page>

<page>
  <title>Call Details - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/calls-id</url>
  <content>Your API key for authentication.

Use your own Twilio account and only return inbound numbers associated with that account sid (optional).

### Path Parameters

The unique identifier of the call for which you want to retrieve detailed information.

### Response

An array of phrases spoken during the call.

Each index includes:

*   `id`
*   `created_at`
*   `text`
*   `user` (can be `user`, `assistant`, `robot`, or `agent-action`)

The unique identifier for the call.

The length of the call in minutes.

Number that the person was transferred to.

If the call is part of a batch, it’s `batch_id` will be here.

The phone number that received the call.

The phone number that made the call.

Details about parameters in the original api request.

Whether the call has been completed. If it differs from the value of ‘queue\_status’, this will be the most up-to-date status.

Whether the call was inbound or outbound. Will be `false` for outbound calls.

The timestamp for when the call request was created.

The time the call was connected.

The time that the call will automatically be ended at if it’s still connected (because of `max_duration`).

The status of the call. During extremely high volume periods, calls may be queued for a short period of time before being dispatched.

The url of the deployment that the call was handled on. Will always be “api.prod.bland.ai” unless the call was handled on a custom Enterprise deployment.

The maximum length of time the call was allowed to last. If the call would exceed this length, it’s ended early.

If an error occurs, this will contain a description of the error. Otherwise, it will be null.

Variables created during the call - both system variables as well as generated with `dynamic_data` or Custom Tools.

For example, if you used a `dynamic_data` API request to generate a variable called `appointment_time`, you would see it here (both the agent’s inputs and the response variables).

If `answered_by_enabled` was set to `true` in the original API request, this field contains one of the following values:

*   `human`: The call was answered by a human.
*   `voicemail`: The call was answered by an answering machine or voicemail.
*   `unknown`: There was not enough audio at the start of the call to make a determination.
*   `no-answer`: The call was not answered.
*   `null`: Not enabled, or still processing the result.

If `answered_by_enabled` was set to `true`, then webhooks may take up to a minute to fire after the call ends while the call audio is processed.

Whether the call audio was recorded.

The URL of the recording of the call. Only available if `record` was set to `true` in the original API request.

Metadata about the call. This can include information about the client, customer, or any other data you want to include.

This is identical to the `metadata` that was set in the original API request to send the call.

A short summary of the call based off of the transcript that’s generated when the call ends.

The cost of the call in USD.

Whether Local Dialing was enabled for your account at the time of the call.

Whether the call was ended by Bland’s system or the other end of the line.

*   `ASSISTANT`: The agent ended the call.
*   `USER`: The user ended the call.

Pathways calls will have extra logs here that have much more detailed information about the chosen nodes and internal reasoning throughout the flow.

The provided structure used in the post call analysis. This is the raw skeleton describing the data structure that will be filled in once the call ends.

The data filled in by the post call analysis. This is the raw data that was generated by the analysis schema.

A single string containing all of the text from the call. Excludes system messages and auto-generated data.

An array of phrases spoken during the call.

Each index includes:

*   `id`
*   `created_at`
*   `text`
*   `user` (can be `user`, `assistant`, `robot`, or `agent-action`)

The status of the call. This is the most up-to-date status of the call, but is only present for calls that have been successfully created.

The corrected duration of the call in seconds. This is the actual length of the call, not the `max_duration`.</content>
</page>

<page>
  <title>Update Knowledge Base - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/patch/vectors-id</url>
  <content>Usage: Pass the `vector_id` into your agent’s `tools` to enable the agent to use the knowledge base.

Your API key for authentication.

### Path Parameters

The `vector_id` of the knowledge base to update.

### Body

The name of the knowledge base. Make this a clear name that describes the contents of the store.

A description of the knowledge base. This can be a longer description of the contents of the knowledge base, or what terms to use to search for vectors in the knowledge base.

This is visible to the AI, so making it descriptive can help the AI understand when to use it or not.

The full text document to be stored and vectorized.

### Response

The unique identifier for the knowledge base.

Will start with “KB-”.</content>
</page>

<page>
  <title>Get Single Pathway Information - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/pathway</url>
  <content>Returns a set of information about the conversational pathway in your account - including the name, description, nodes and edges.

### Headers

Your API key for authentication.

### Path Parameters

The unique identifier of the conversational pathway for which you want to retrieve detailed information.

### Response

The name of the conversational pathway.

A description of the conversational pathway.

Data about all the nodes in the pathway.

Examples of JSON objects for nodes (Horizontal scroll the tab bar to see more examples)

Data about all the edges in the pathway.</content>
</page>

<page>
  <title>Delete Knowledge Base - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/delete/vectors-id</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)</content>
</page>

<page>
  <title>Clone a Voice - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/voices</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#body)

Body

[​](#param-name)

name

string

required

The name to identify your cloned voice.

[​](#param-audio-samples)

audio\_samples

file\[\]

required

One or more audio files to use as samples for voice cloning.

### 

[​](#response)

Response

[​](#param-voice-id)

voice\_id

integer

The unique identifier for the cloned voice.

[​](#param-name-1)

name

string

The name you provided for the voice.</content>
</page>

<page>
  <title>List Knowledge Base Details - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/vectors-id</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-vector-id)

vector\_id

string

required

The `vector_id` of the knowledge base to view.

### 

[​](#query-parameters)

Query Parameters

[​](#param-include-text)

include\_text

boolean

default:

false

Include the full text of the documents stored in the knowledge base. This can be useful for debugging, but may return large amounts of data.

### 

[​](#response)

Response

[​](#param-vector-id-1)

vector\_id

string

The unique identifier for the knowledge base.

[​](#param-name)

name

string

The name of the knowledge base.

[​](#param-description)

description

string

A description of the knowledge base.</content>
</page>

<page>
  <title>Get corrected transcripts - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/calls-corrected-transcript</url>
  <content>Your API key for authentication.

### Path Parameters

The unique identifier for the call to be corrected.

### Response

Will be `success` if the request was successful.

Confirms the request was successful, or provides an error message if the request failed.

This will contain an array of objects. Each object will be constructed as the following.

Corrected transcripts provides us with a raw output that is generally unusable because we can’t eveen neccessarily align the ‘assistant’ and ‘user’ roles. To fix this, we provide our version of an ‘aligned’ transcript. This means essentailly a transcript where the roles are matched to the pieces of text.

We do this by vectorizing the text, taking the cosine similarity, and adding a predictive layer based off of the `wait_for_greeting` param (essentially how sure are we that assistant or user spoke first).

This will contain an array of objects. Each object will be constructed as the following.</content>
</page>

<page>
  <title>Number Details - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/inbound-number</url>
  <content>Your API key for authentication.

### Path Parameters

The inbound phone number to update.

Formatting notes:

*   The `'+'` or `'%2B'` prefix is optional.
*   Will assume a US country code if no country code is provided.

Valid Examples for `+13334445555`:

*   `%2B13334445555`
*   `13334445555`
*   `3334445555`

### Response

The timestamp when the inbound number was configured.

The specific inbound phone number.

The prompt your agent is using.

The webhook URL, if any, where transcripts are sent after each call to the number completes.

The `voice` your agent is currently using.

For more information, see [List Voices](https://docs.bland.ai/api-v1/get/voices).

The background track your agent is using.

Will be `null` by default, until an option such as `office`, `cafe`, `restaurant`, or `none` is applied.

The `pathway_id` your agent is using.

Any dynamic data associated with the inbound number, if applicable.

The maximum duration of a call to the inbound number, in minutes.</content>
</page>

<page>
  <title>Delete a Voice - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/delete/voices-id</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

Voices

Delete an existing cloned voice.

DELETE

/

v1

/

voices

/

{id}

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-id)

id

string

required

The `id` of the voice to delete.

### 

[​](#response)

Response

[​](#param-voice-id)

voice\_id

integer

The unique identifier of the deleted voice.

[Rename a Voice](https://docs.bland.ai/api-v1/patch/voices-id)[List Voices](https://docs.bland.ai/api-v1/get/voices)</content>
</page>

<page>
  <title>Rename a Voice - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/patch/voices-id</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-id)

id

string

required

The `id` of the voice to update.

### 

[​](#body)

Body

[​](#param-name)

name

string

required

The new name for your cloned voice.

### 

[​](#response)

Response

[​](#param-voice-id)

voice\_id

integer

The unique identifier of the renamed voice.

[​](#param-name-1)

name

string

The updated name of the voice.</content>
</page>

<page>
  <title>List Numbers - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/inbound</url>
  <content>Numbers

Retrieves a list of all inbound phone numbers configured for your account, along with their associated settings.

GET

/

v1

/

inbound

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

[​](#param-encrypted-key)

encrypted\_key

string

Use your own Twilio account and only return inbound numbers associated with that account sid (optional).

### 

[​](#response)

Response

[​](#param-inbound-numbers)

inbound\_numbers

array

An array of objects, each representing an inbound phone number and its configuration.

[Update Inbound Number Details](https://docs.bland.ai/api-v1/post/inbound-number-update)[Number Details](https://docs.bland.ai/api-v1/get/inbound-number)</content>
</page>

<page>
  <title>List Voices - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/voices</url>
  <content>Your API key for authentication.

### Response

Contains a list of the voices available for your account.

The unique identifier for the voice.

The name of the voice. This value can also be used in the `voice` parameter when sending calls.

A brief description of the voice.

Indicates whether the voice is publicly available or specific to your account.

A list of tags that describe the voice. We recommend “Bland Curated” voices for the best quality over the phone.

The number of ratings the voice has received.

The average rating of the voice, out of 5.

Note: Ratings are under development at this time and may display incomplete/inaccurate data.</content>
</page>

<page>
  <title>Voice Details - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/voices-id</url>
  <content>Your API key for authentication.

### Path Parameters

The unique identifier for the voice preset.

Place either the voice’s `name` or `id` here.

For example, `GET https://api.bland.ai/v1/voices/david` or `GET https://api.bland.ai/v1/voices/ff2c405b-3dba-41e0-9261-bc8ee3f91f46`.

### Response

Contains detailed information about the specified voice.

*   `id` - The unique id for that voice.
    
*   `name` - Public voice name, and can also be used as a unique identifier.
    
*   `description` - The description of the voice.
    
*   `public` - Whether or not the voice is publicly available.
    
*   `tags` - A list of tags associated with the voice for the language, voice details, and will have `"Bland Curated"` for preferred voices.
    
*   `average_rating` - The average star ratings for the voice (out of 5 stars).
    
*   `total_ratings` - The number of ratings for the voice.
    

Note: Ratings are under development and may show incomplete or inaccurate data.</content>
</page>

<page>
  <title>Generate Audio Sample - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/voices-id-sample</url>
  <content>Your API key for authentication.

### Path Parameters

The ID of the voice to generate the audio sample for, or it’s name (like “maya”).

### Request Body

The text content to be spoken in the voice sample.

Character limit: `200` characters.

Alternate `voice_settings` can be passed in to override the preset’s default settings.

The language of the text content. Default is `ENG`.

Some other language codes: “ESP”, “GER”, “FRE”

### Response

The generated audio file of the spoken text using the specified or overridden voice preset settings.</content>
</page>

<page>
  <title>Delete Custom Tool - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/delete/tools-tool-id</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

Custom Tools

Delete your Custom Tool.

DELETE

/

v1

/

tools

/

{tool\_id}

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-tool-id)

tool\_id

string

required

The ID of the Custom Tool you want to update.

### 

[​](#response)

Response

[​](#param-status)

status

string

Whether the tool creation succeeded.

[Update Custom Tool](https://docs.bland.ai/api-v1/post/tools-tool-id)[List Custom Tools](https://docs.bland.ai/api-v1/get/tools)</content>
</page>

<page>
  <title>Publish Cloned Voice - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/voiceId-publish</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-voice-id)

voiceId

string

required

The ID of the voice to generate the audio sample for, or it’s name (like “maya”).

### 

[​](#response)

Response

[​](#param-status)

status

string

The status of the request

[​](#param-message)

message

string

Information regarding the status of your request.

[​](#param-voice)

voice

object

Object containing data of the voice.

[​](#param-voice-id)

voice.id

string

Id of the voice.

[​](#param-voice-name)

voice.name

string

Name of the voice

[​](#param-voice-tags)

voice.tags

string

Tags for the voice.</content>
</page>

<page>
  <title>Update Inbound Number Details - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/inbound-number-update</url>
  <content>Your API key for authentication.

The `encrypted_key` for the Twilio account that owns the phone number you want to modify. Not required if you are using a Bland phone number.

### Path Parameters

The inbound phone number you wish to update.

Formatting Notes:

*   The `'+'` or `'%2B'` prefix is optional.
*   Will assume a US country code if no country code is provided.

Valid Examples for `+13334445555`:

*   `%2B13334445555`
*   `13334445555`
*   `3334445555`

### Body

Provide instructions, relevant information, and examples of the ideal conversation flow.

For inbound numbers, consider including additional context about the purpose of the call, and what types of callers to expect.

Set the pathway that your agent will follow. This will override the `prompt` field, so there is no need to pass the ‘prompt’ field if you are setting a pathway.

Warning: Setting a pathway will set the following fields to `null` / their default value - `prompt`, `first_sentence`, `model`, `dynamic_data`, `tools`, `transfer_list`

Set to `null` or an empty string to clear the pathway.

### Agent Parameters (Body)

Set your agent’s voice - all available voices can be found with the [List Voices](https://docs.bland.ai/api-v1/get/voices) endpoint.

Select an audio track that you’d like to play in the background during the call. The audio will play continuously when the agent isn’t speaking, and is incorporated into it’s speech as well.

Use this to provide a more natural, seamless, engaging experience for the conversation. We’ve found this creates a significantly smoother call experience by minimizing the stark differences between total silence and the agent’s speech.

Options:

*   `null` - Default, will play audible but quiet phone static.
*   `office` - Office-style soundscape. Includes faint typing, chatter, clicks, and other office sounds.
*   `cafe` - Cafe-like soundscape. Includes faint talking, clinking, and other cafe sounds.
*   `restaurant` - Similar to `cafe`, but more subtle.
*   `none` - Minimizes background noise

Makes your agent say a specific phrase or sentence for it’s first response.

By default, the agent starts talking as soon as the call connects.

When `wait_for_greeting` is set to `true`, the agent will wait for the call recipient to speak first before responding.

Adjusts how patient the AI is when waiting for the user to finish speaking.

Lower values mean the AI will respond more quickly, while higher values mean the AI will wait longer before responding.

Recommended range: 50-200

*   50: Extremely quick, back and forth conversation
*   100: Balanced to respond at a natural pace
*   200: Very patient, allows for long pauses and interruptions. Ideal for collecting detailed information.

Try to start with 100 and make small adjustments in increments of ~10 as needed for your use case.

Select a model to use for your call.

Options: `base`, `turbo` and `enhanced`.

In nearly all cases, `enhanced` is the best choice for now.

Interact with the real world through API calls.

Detailed tutorial here: [Custom Tools](https://docs.bland.ai/tutorials/custom-tools)

Select a supported language of your choice. Optimizes every part of our API for that language - transcription, speech, and other inner workings.

timezone

default:

"America/Los\_Angeles"

Set the timezone for the call. Handled automatically for calls in the US.

This helps significantly with use cases that rely on appointment setting, scheduling, or behaving differently based on the time of day.

Timezone options are [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) in the TZ identifier column.

A phone number that the agent can transfer to under specific conditions - such as being asked to speak to a human or supervisor.

Set to `null` to remove.

Give your agent the ability to transfer calls to a set of phone numbers.

Overrides `transfer_phone_number` if a `transfer_list.default` is specified.

Will default to `transfer_list.default`, or the chosen phone number.

Example usage to route calls to different departments:

Integrate data from external APIs into your agent’s knowledge.

Set to `null` or an empty string to clear dynamic data settings.

Detailed usage in the [Send Call](https://docs.bland.ai/api-v1/post/calls) endpoint.

Adjusts how patient the AI is when waiting for the user to finish speaking.

Lower values mean the AI will respond more quickly, while higher values mean the AI will wait longer before responding.

Recommended range: 50-200

*   50: Extremely quick, back and forth conversation
*   100: Balanced to respond at a natural pace
*   200: Very patient, allows for long pauses and interruptions. Ideal for collecting detailed information.

Try to start with 100 and make small adjustments in increments of ~10 as needed for your use case.

These words will be boosted in the transcription engine - recommended for proper nouns or words that are frequently mis-transcribed.

For example, if the word “Reece” is frequently transcribed as a homonym like “Reese” you could do this:

For stronger keyword boosts, you can place a colon then a boost factor after the word. The default boost factor is 2.

### Call Settings (Body)

When the call starts, a timer is set for the `max_duration` minutes. At the end of that timer, if the call is still active it will be automatically ended.

Example Values: `20, 2`

When the call ends, we’ll send the call details in a POST request to the URL you specify here.

The request body will match the response from the [GET /v1/calls/:call\_id](https://docs.bland.ai/api-v1/get/calls-id) endpoint.

Define a JSON schema for how you want to get information about the call - information like email addresses, names, appointment times or any other type of custom data.

In the webhook response or whenever you retrieve call data later, you’ll get the data you defined back under `analysis`.

For example, if you wanted to retrieve this information from the call:

You would get it filled out like this in your webhook once the call completes:

Add any additional information you want to associate with the call. This can be useful for tracking or categorizing calls.

At the end of each call, a `summary` is generated based on the transcript - you can use this field to add extra instructions and context for how it should be summarized.

For example: `"Summarize the call in French instead of English."`

Guides the output and provides additional instructions and clarifications for the `analysis_schema`.

To record your phone call, set `record` to true. When your call completes, you can access through the `recording_url` field in the call details or your webhook.

### Response

Whether the update was successful or not - will be `success` or `error`.

A message describing the status of the update.

An object containing the updated settings for the inbound number.

If the update was unsuccessful, this will contain the settings that failed to update. Useful to determine how your request is being interpreted on our end.</content>
</page>

<page>
  <title>List Custom Tools - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/tools</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

Custom Tools

Retrieve Custom Tools you’ve created.

GET

/

v1

/

tools

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#response)

Response

[​](#param-status)

status

string

Whether the requet succeeded or failed.

[​](#param-tools)

tools

array

An array of your available tools.

[Delete Custom Tool](https://docs.bland.ai/api-v1/delete/tools-tool-id)[Custom Tool Details](https://docs.bland.ai/api-v1/get/tools-tool-id)</content>
</page>

<page>
  <title>Custom Tool Details - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/tools-tool-id</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

Custom Tools

Retrieve a Custom Tool you’ve created.

GET

/

v1

/

tools

/

{tool\_id}

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-tool-id)

tool\_id

string

required

The ID of the tool you want to retrieve (starting with `TL-`).

### 

[​](#response)

Response

[​](#param-status)

status

string

Whether the requet succeeded or failed.

[​](#param-tool)

tool

array

The tool you’ve created.

[List Custom Tools](https://docs.bland.ai/api-v1/get/tools)[Create a Web Agent](https://docs.bland.ai/api-v1/post/agents)</content>
</page>

<page>
  <title>Authorize a Web Agent Call - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/agents-id-authorize</url>
  <content>Your API key for authentication.

Example web call usage (client side):

    import { BlandWebClient } from 'bland-client-js-sdk';
    
    const agentId = 'YOUR-AGENT-ID';
    const sessionToken = 'YOUR-SESSION-TOKEN';
    
    
    document.addEventListener('DOMContentLoaded', async () => {
        document.getElementById('btn').addEventListener('click', async () => {
            const blandClient = new BlandWebClient(
                agentId,
                sessionToken
            );
            await blandClient.initConversation({
                sampleRate: 44100,
            });
        });
    });</content>
</page>

<page>
  <title>Delete Encrypted Key - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/accounts-delete</url>
  <content>Disable an encrypted key for a Twilio account integration. See [Enterprise Twilio Integration](https://docs.bland.ai/enterprise-features/custom-twilio) for more information.

### Headers

Your API key for authentication.

The `encrypted_key` to delete.

### Response

The status of the request.

*   `success` - The encrypted key was successfully deleted.
*   `error` - There was an error deleting the encrypted key.

Special messages:

*   `Error deleting Twilio credentials` - The encrypted key could not be deleted or already has been deleted.
*   `Missing encrypted key` - The `encrypted_key` parameter is missing.
*   none - The encrypted key was successfully deleted.</content>
</page>

<page>
  <title>Delete Web Agent - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/agents-id-delete</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

Web Agents

Delete a web agent.

POST

/

v1

/

agents

/

{agent\_id}

/

delete

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path)

Path

[​](#param-agent-id)

agent\_id

string

required

The web agent to delete.

### 

[​](#response)

Response

[​](#param-status)

status

string

Can be `success` or `error`.

[​](#param-message)

message

string

A message saying whether the deletion succeeded, or a helpful message describing why it failed.

[Authorize a Web Agent Call](https://docs.bland.ai/api-v1/post/agents-id-authorize)[List Web Agents](https://docs.bland.ai/api-v1/get/agents)</content>
</page>

<page>
  <title>Create Encrypted Key - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/accounts</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)</content>
</page>

<page>
  <title>List Web Agents - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/agents</url>
  <content>Your API key for authentication.

### Response

Each agent object, containing the following fields:

*   `agent_id` (string): The unique identifier for the agent.
*   `webhook` (string): The webhook URL for the agent.
*   `dynamic_data` (array): An array of dynamic data objects.
*   `interruption_threshold` (number): The threshold for agent interruption.
*   `first_sentence` (string): The first sentence the agent will say.
*   `model` (string): The model used by the agent.
*   `voice_settings` (object): The voice settings for the agent.
*   `voice` (string): The voice used by the agent.
*   `prompt` (string): The prompt for the agent.
*   `temperature` (number): The temperature setting for the agent.
*   `max_duration` (number): The maximum call duration for the agent.
*   `language` (string): The language used by the agent.
*   `tools` (array): An array of Custom Tools the agent can use.</content>
</page>

<page>
  <title>Upload Inbound Phone Numbers - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/inbound-insert</url>
  <content>Add inbound numbers to Bland from your own Twilio account. See [Enterprise Twilio Integration](https://docs.bland.ai/enterprise-features/custom-twilio) for more information.

### Headers

Your API key for authentication.

The `encrypted_key` of the Twilio account you want to upload numbers from.

### Body

### Response

A message saying whether the insertion succeeded, or a helpful message describing why it failed.

An array of phone numbers that were successfully inserted.

Any phone numbers that failed to be inserted will not be included in this array - for example if they are already in your account or not associated with the sepcified Twilio account.</content>
</page>

<page>
  <title>Update Web Agent Settings - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/agents-id</url>
  <content>Your API key for authentication.

### Path Parameters

The web agent you’ll be updating.

### Body

Provide instructions, relevant information, and examples of the ideal conversation flow.

Set your agent’s voice - all available voices can be found with the [List Voices](https://docs.bland.ai/api-v1/get/voices) endpoint.

Set a webhook URL to receive call data after the web call completes.

Define a JSON schema for how you want to get information about the call - information like email addresses, names, appointment times or any other type of custom data.

In the webhook response or whenever you retrieve call data later, you’ll get the data you defined back under `analysis`.

For example, if you wanted to retrieve this information from the call:

You would get it filled out like this in your webhook once the call completes:

Add any additional information you want to associate with the call. This can be useful for tracking or categorizing calls.

Set the pathway that your agent will follow. This will override the `prompt` field, so there is no need to pass the ‘prompt’ field if you are setting a pathway.

Warning: Setting a pathway will set the following fields to `null` / their default value - `prompt`, `first_sentence`, `model`, `dynamic_data`, `tools`, `transfer_list`

Set to `null` or an empty string to clear the pathway.

Select a supported language of your choice. Optimizes every part of our API for that language - transcription, speech, and other inner workings.

Supported Languages and their codes:

*   English: `ENG`
*   Spanish: `ESP`
*   French: `FRE`
*   Polish: `POL`
*   German: `GER`
*   Italian: `ITA`
*   Brazilian Portuguese: `PBR`
*   Portuguese: `POR`

The webhook should be a http / https callback url. We will send the call\_id and transcript to this URL after the call completes. This can be useful if you want to have real time notifications when calls finish.

Set to `null` or an empty string to clear the webhook.

Select a model to use for your call.

Options: `base`, `turbo` and `enhanced`.

In nearly all cases, `enhanced` is the best choice for now.

A phrase that your call will start with instead of a generating one on the fly. This works both with and without `wait_for_greeting`. Can be more than one sentence, but must be less than 200 characters.

To remove, set to `null` or an empty string.

Interact with the real world through API calls.

Detailed tutorial here: [Custom Tools](https://docs.bland.ai/tutorials/custom-tools)

Integrate data from external APIs into your agent’s knowledge.

Set to `null` or an empty string to clear dynamic data settings.

Detailed usage in the [Send Call](https://docs.bland.ai/api-v1/post/calls) endpoint.

Adjusts how patient the AI is when waiting for the user to finish speaking.

Lower values mean the AI will respond more quickly, while higher values mean the AI will wait longer before responding.

Recommended range: 50-200

*   50: Extremely quick, back and forth conversation
*   100: Balanced to respond at a natural pace
*   200: Very patient, allows for long pauses and interruptions. Ideal for collecting detailed information.

Try to start with 100 and make small adjustments in increments of ~10 as needed for your use case.

The maximum duration that calls to your agent can last before being automatically terminated.

Set to `null` to reset to default.

### Response

Whether the update was successful or not - will be `success` or `error`.

A message describing the status of the update.

An object containing the updated settings for the agent.

If the update was unsuccessful, this will contain the settings that failed to update. Useful to determine how your request is being interpreted on our end.</content>
</page>

<page>
  <title>Delete Inbound Phone Number - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/inbound-number-delete</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

[​](#param-encrypted-key)

encrypted\_key

string

required

The `encrypted_key` for the Twilio account that owns the phone number you want to delete.

### 

[​](#path)

Path

[​](#param-phone-number)

phone\_number

string

required

The phone number you want to remove from Bland’s system.

### 

[​](#response)

Response

[​](#param-status)

status

string

Can be `success` or `error`.

[​](#param-message)

message

string

A message saying whether the deletion succeeded, or a helpful message describing why it failed.</content>
</page>

<page>
  <title>Create a Web Agent - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/agents</url>
  <content>Your API key for authentication.

Example web call usage (client side):

### Body

Provide instructions, relevant information, and examples of the ideal conversation flow.

Set your agent’s voice - all available voices can be found with the [List Voices](https://docs.bland.ai/api-v1/get/voices) endpoint.

Set a webhook URL to receive call data after the web call completes.

Define a JSON schema for how you want to get information about the call - information like email addresses, names, appointment times or any other type of custom data.

In the webhook response or whenever you retrieve call data later, you’ll get the data you defined back under `analysis`.

For example, if you wanted to retrieve this information from the call:

You would get it filled out like this in your webhook once the call completes:

Add any additional information you want to associate with the call. This can be useful for tracking or categorizing calls.

Set the pathway that your agent will follow. This will override the `prompt` field, so there is no need to pass the ‘prompt’ field if you are setting a pathway.

Warning: Setting a pathway will set the following fields to `null` / their default value - `prompt`, `first_sentence`, `model`, `dynamic_data`, `tools`, `transfer_list`

Set to `null` or an empty string to clear the pathway.

Select a supported language of your choice. Optimizes every part of our API for that language - transcription, speech, and other inner workings.

Supported Languages and their codes:

*   English: `ENG`
*   Spanish: `ESP`
*   French: `FRE`
*   Polish: `POL`
*   German: `GER`
*   Italian: `ITA`
*   Brazilian Portuguese: `PBR`
*   Portuguese: `POR`

Select a model to use for your call.

Options: `base`, `turbo` and `enhanced`.

In nearly all cases, `enhanced` is the best choice for now.

A phrase that your call will start with instead of a generating one on the fly. This works both with and without `wait_for_greeting`. Can be more than one sentence, but must be less than 200 characters.

To remove, set to `null` or an empty string.

Interact with the real world through API calls.

Detailed tutorial here: [Custom Tools](https://docs.bland.ai/tutorials/custom-tools)

Integrate data from external APIs into your agent’s knowledge.

Set to `null` or an empty string to clear dynamic data settings.

Detailed usage in the [Send Call](https://docs.bland.ai/api-v1/post/calls) endpoint.

Adjusts how patient the AI is when waiting for the user to finish speaking.

Lower values mean the AI will respond more quickly, while higher values mean the AI will wait longer before responding.

Recommended range: 50-200

*   50: Extremely quick, back and forth conversation
*   100: Balanced to respond at a natural pace
*   200: Very patient, allows for long pauses and interruptions. Ideal for collecting detailed information.

Try to start with 100 and make small adjustments in increments of ~10 as needed for your use case.

These words will be boosted in the transcription engine - recommended for proper nouns or words that are frequently mis-transcribed.

For example, if the word “Reece” is frequently transcribed as a homonym like “Reese” you could do this:

For stronger keyword boosts, you can place a colon then a boost factor after the word. The default boost factor is 2.

The maximum duration that calls to your agent can last before being automatically terminated.

Set to `null` to reset to default.

### Response

A unique identifier for the call (present only if status is `success`).</content>
</page>

<page>
  <title>Update Custom Tool - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/tools-tool-id</url>
  <content>Your API key for authentication.

### Path Parameters

The ID of the Custom Tool you want to update.

### Body

This is the name that the AI using the tool will see.

Some other internal tools are named `Speak`, `Wait`, `Transfer` and `Finish` - Custom Tools cannot share these names.

We’ve made a list of reserved words that can confuse the AI that cannot be included:

*   `input`
*   `speak`
*   `transfer`
*   `switch`
*   `wait`
*   `finish`
*   `press`
*   `button`
*   `say`
*   `pause`
*   `record`
*   `play`
*   `dial`
*   `hang`

Choosing too similar of names to the default tools could cause the AI to select the wrong one, so decriptive two to three-word names are preferred.

This is the description that the AI using the tool will see.

Describe the effect of what the tool does or any special instructions.

For reference, here are the default tools’ descriptions:

*   `Speak`: Talk to the person on the other end of the line
*   `Press Buttons`: Presses buttons on phone. Each character is a different button.
*   `Wait`: Wait and go silent for an extended period of time (only use if absolutely necessary).
*   `Finish`: Say a goodbye message and end the call once completed.

This is the text that the AI will say while it uses the tool.

For example, if the tool is a “GenerateQuote” tool, the speech might be “Please wait while I get you your quote.”

Since tools can be verbally interrupted, shorter messages that tell the user what the tool/AI are doing are best.

Special Note: You can have the AI dynamically generate speech by defining `input.speech` in the `input_schema`.

This is the endpoint of the external API that the tool will call.

It must begin with `https://` and be a valid URL.

This is the HTTP method that the tool will use to call the external API.

Valid options are `GET` and `POST`.

`SUPPORTS PROMPT VARIABLES`

These are the headers that the tool will send to the external API.

The headers must be in JSON format.

Since prompt variables are supported, you can use them in the headers to send dynamic information to the external API.

`SUPPORTS PROMPT VARIABLES`

This is the body that the tool will send to the external API.

The body must be in JSON format.

This is the most common place to use Prompt Variables with AI input.

Note: `GET` requests do not have a body.

`SUPPORTS PROMPT VARIABLES`

Append query parameters to the URL.

The query must be in JSON format.

This is generally used with GET requests and built-in Prompt Variables like `"{{phone_number}}"` or `"{{call_id}}"`.

This is the schema that the AI input must match for the tool to be used.

The schema must be in JSON format.

The schema is used to validate the AI input before the tool is used.

If the AI input does not match the schema, the tool will not be used and the AI will move on to the next tool.

`input_schema.example` can be used to enhance the AI’s understanding of the input structure and helps significantly with structured or nested data.

Special Note: `input_schema` does not require strict JSON schema structure, and creativity is encouraged.

[Look here for a general guide on JSON schema structures.](https://json-schema.org/learn/getting-started-step-by-step)

Non-traditional JSON schema structures are supported as well, like these examples:

*   “options”: “monday, wednesday, friday”
*   “date”: “YYYY-MM-DD”
*   “time”: “HH:MM:SS (AM|PM)”
*   “phone\_number”: “+1XXX-XXX-XXXX”

Agent input can be nested, and the will be transformed into JSON even if it’s initially a string.

Define how you would like to extract data from the response.

By default, the entire response body is stored in the `{{data}}` Prompt Variable.

The path to the data you want must be in JSON Path format. Generally this means using dot notation to traverse the JSON object and is only required if you need to use that information on other tools or the response is too large.

Example:

This is the maximum time in milliseconds that the tool will wait for a response from the external API.

If the external API does not respond within this time, the tool will fail and the AI will move on to the next tool.

The default timeout is 10 seconds (10000 milliseconds).

To always wait for a response, set the timeout to an extremely high value like 99999999.

### Response

Whether the tool creation succeeded.

A tool id that you can use to reference the tool in the future.

In a Send Call request, you could pass this tool id in instead of the full Custom Tool object like so:</content>
</page>

<page>
  <title>Send a Batch of Calls - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/batches</url>
  <content>Your API key for authentication.

### Body

This is the prompt or task used for all the phone calls in the request. Information can be inserted into it surrounding variable names with {{curly braces}}.

Example:

Define a list of calls to make and their properties. Each call in call\_data MUST have a “phone\_number” property. Properties are case-sensitive.

Example:

Use a purchased number to send batch calls from. We do not recommend this for large batches as there is risk of your number getting flagged for spam.

Adds a user-friendly label to your batch to keep track of it’s original intention. This can help differentiate multiple call batches that are part of the same Campaign. Shown when a batch is retreived.

Use `campaign_id` to organize related batches together. This can be set manually or auto-generated through Campaigns.

When this is set to `true`, only the first call of `call_data` will be dispatched. A common use case is to set the first `phone_number` value to your own to confirm everything’s set up properly.

Includes additional information in the response when true so that it’s easier to find any issues.

All other parameters supported by the [Send Call](https://docs.bland.ai/api-v1/post/calls) endpoint are supported here as well. They will be applied to each call in the batch.

A URL that will receive a POST request when the batch is completed. The request will include the batch\_id and the status of the batch.

### Response

If anything other than “success” is returned, there was an error.

The unique identifier for the batch.</content>
</page>

<page>
  <title>Create a Custom Tool - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/tools</url>
  <content>Your API key for authentication.

### Body

This is the name that the AI using the tool will see.

Some other internal tools are named `Speak`, `Wait`, `Transfer` and `Finish` - Custom Tools cannot share these names.

We’ve made a list of reserved words that can confuse the AI that cannot be included:

*   `input`
*   `speak`
*   `transfer`
*   `switch`
*   `wait`
*   `finish`
*   `press`
*   `button`
*   `say`
*   `pause`
*   `record`
*   `play`
*   `dial`
*   `hang`

Choosing too similar of names to the default tools could cause the AI to select the wrong one, so decriptive two to three-word names are preferred.

This is the description that the AI using the tool will see.

Describe the effect of what the tool does or any special instructions.

For reference, here are the default tools’ descriptions:

*   `Speak`: Talk to the person on the other end of the line
*   `Press Buttons`: Presses buttons on phone. Each character is a different button.
*   `Wait`: Wait and go silent for an extended period of time (only use if absolutely necessary).
*   `Finish`: Say a goodbye message and end the call once completed.

This is the text that the AI will say while it uses the tool.

For example, if the tool is a “GenerateQuote” tool, the speech might be “Please wait while I get you your quote.”

Since tools can be verbally interrupted, shorter messages that tell the user what the tool/AI are doing are best.

Special Note: You can have the AI dynamically generate speech by defining `input.speech` in the `input_schema`.

This is the endpoint of the external API that the tool will call.

It must begin with `https://` and be a valid URL.

This is the HTTP method that the tool will use to call the external API.

Valid options are `GET` and `POST`.

`SUPPORTS PROMPT VARIABLES`

These are the headers that the tool will send to the external API.

The headers must be in JSON format.

Since prompt variables are supported, you can use them in the headers to send dynamic information to the external API.

`SUPPORTS PROMPT VARIABLES`

This is the body that the tool will send to the external API.

The body must be in JSON format.

This is the most common place to use Prompt Variables with AI input.

Note: `GET` requests do not have a body.

`SUPPORTS PROMPT VARIABLES`

Append query parameters to the URL.

The query must be in JSON format.

This is generally used with GET requests and built-in Prompt Variables like `"{{phone_number}}"` or `"{{call_id}}"`.

This is the schema that the AI input must match for the tool to be used.

The schema must be in JSON format.

The schema is used to validate the AI input before the tool is used.

If the AI input does not match the schema, the tool will not be used and the AI will move on to the next tool.

`input_schema.example` can be used to enhance the AI’s understanding of the input structure and helps significantly with structured or nested data.

Special Note: `input_schema` does not require strict JSON schema structure, and creativity is encouraged.

[Look here for a general guide on JSON schema structures.](https://json-schema.org/learn/getting-started-step-by-step)

Non-traditional JSON schema structures are supported as well, like these examples:

*   “options”: “monday, wednesday, friday”
*   “date”: “YYYY-MM-DD”
*   “time”: “HH:MM:SS (AM|PM)”
*   “phone\_number”: “+1XXX-XXX-XXXX”

Agent input can be nested, and the will be transformed into JSON even if it’s initially a string.

Define how you would like to extract data from the response.

By default, the entire response body is stored in the `{{data}}` Prompt Variable.

The path to the data you want must be in JSON Path format. Generally this means using dot notation to traverse the JSON object and is only required if you need to use that information on other tools or the response is too large.

Example:

This is the maximum time in milliseconds that the tool will wait for a response from the external API.

If the external API does not respond within this time, the tool will fail and the AI will move on to the next tool.

The default timeout is 10 seconds (10000 milliseconds).

To always wait for a response, set the timeout to an extremely high value like 99999999.

### Response

Whether the tool creation succeeded.

A tool id that you can use to reference the tool in the future.

In a Send Call request, you could pass this tool id in instead of the full Custom Tool object like so:</content>
</page>

<page>
  <title>Analyze Batch with AI - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/batches-id-analyze</url>
  <content>Your API key for authentication.

### Path Parameters

The unique identifier for the batch of calls to be analyzed.

### Request Body

This is the overall purpose of the batch of calls. Provides context for the analysis to guide how the questions/transcripts are interpreted.

An array of questions to be analyzed for each call in the batch.

Each question should be an array with two elements: the question text and the expected answer type (e.g., “string”, “boolean”).

Fairly flexible in terms of the expected answer type, and unanswerable questions will default to `null`.

Examples:

### Response

Will be `success` if the request was successful.

Confirms the request was successful, or provides an error message if the request failed.

Contains the analyzed answers for each call in the batch.

The keys are `call_id`s from the batch, and the array values are the analysis results for each question in the batch.

Token-based price for the analysis request.

As a rough estimate, the base cost is `0.003` credits with an additional `0.0015` credits per call in the batch.

Longer call transcripts and higher numbers of questions can increase the cost, however the cost scales very effectively with batches vs. individual calls.</content>
</page>

<page>
  <title>List Batches - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/batches</url>
  <content>Your API key for authentication.

### Query Parameters

Retrieve only batches with a specific campaign ID.

The starting index (inclusive) for the range of batches to retrieve.

The ending index for the range of batches to retrieve.

The maximum number of batches to return in the response.

Whether to sort the batches in ascending order of their creation time.

### Response

Contains an array of batch objects.

The unique identifier for the batch.

The original base prompt used to create the batch. Will still contain the original placeholder variables such as `{{ business }}` or `{{ name }}`.

The label you assigned to the batch (if any).

Enterprise customers with custom endpoints will see the endpoint code here (if specified).

The base call parameters used to create the batch, such as `voice_id`, `max_duration`, `reduce_latency`, and `wait_for_greeting`.

The date and time the batch was created.</content>
</page>

<page>
  <title>Stop Active Batch - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/batches-id-stop</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-batch-id)

batch\_id

string

required

The unique identifier for the batch to be cancelled.

### 

[​](#response)

Response

[​](#param-status)

status

string

The status of the request. If anything other than ‘success’, an error has occurred or all calls have already been completed.

[​](#param-message)

message

string

A message describing the status of the request.

[​](#param-num-calls)

num\_calls

number

The number of calls that were cancelled.

[​](#param-batch-id-1)

batch\_id

array

The `batch_id` of the cancelled batch.</content>
</page>

<page>
  <title>Check SMS A2P status - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/sms-check-registration</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)</content>
</page>

<page>
  <title>Clear SMS Conversation - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/sms-clear</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

SMS

Hides all messages in an SMS conversation from the AI’s future responses (without permanently deleting them). For development/debugging.

POST

/

v1

/

sms

/

clear

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#body)

Body

[​](#param-to)

to

string

required

One of the phone numbers in the conversation.

[​](#param-from)

from

string

required

The other phone number in the conversation.

[Update SMS Number](https://docs.bland.ai/api-v1/post/sms-number-update)[SMS Conversation Analysis](https://docs.bland.ai/api-v1/post/sms-analyze)</content>
</page>

<page>
  <title>A2P Registration - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/sms-submit-reg</url>
  <content>Registering an A2P Brand via API
--------------------------------

This documentation provides detailed information on how to register an Application-to-Person (A2P) brand by making a POST request to our API. The process involves submitting your brand’s details for registration and verification purposes.

A2P Registration is required for _all_ businesses who wish to send SMS. There can be significant fines for any non compliant messages. A2P Registration can take 2 days -> 2 Weeks.

Endpoint
--------

`POST /api/registerA2PBrand`

*   `Authorization`: Your API key for authentication.

Request Parameters
------------------

Your request should include a JSON body with the following parameters:

*   `businessName` (string): The legal name of your business.
*   `ein` (string): Your Employer Identification Number.
*   `vertical` (string): Industry vertical. Possible values include: “AUTOMOTIVE”, “AGRICULTURE”, “BANKING”, “CONSTRUCTION”, “CONSUMER”, “EDUCATION”, “ENGINEERING”, “ENERGY”, “OIL\_AND\_GAS”, “FAST\_MOVING\_CONSUMER\_GOODS”, “FINANCIAL”, “FINTECH”, “FOOD\_AND\_BEVERAGE”, “GOVERNMENT”, “HEALTHCARE”, “HOSPITALITY”, “INSURANCE”, “LEGAL”, “MANUFACTURING”, “MEDIA”, “ONLINE”, “PROFESSIONAL\_SERVICES”, “RAW\_MATERIALS”, “REAL\_ESTATE”, “RELIGION”, “RETAIL”, “JEWELRY”, “TECHNOLOGY”, “TELECOMMUNICATIONS”, “TRANSPORTATION”, “TRAVEL”, “ELECTRONICS”, “NOT\_FOR\_PROFIT”
*   `address` (string): The business address.
*   `city` (string): The city of your business.
*   `state` (string): The state of your business. Must be a valid US state code.
*   `postalCode` (string): The postal code of your business.
*   `country` (string): The country of your business.
*   `email` (string): The email address for your business.
*   `type` (string): Legal structure of the business. Possible values: “Partnership”, “Limited Liability Corporation”, “Co-operative”, “Non-profit Corporation”, “Corporation”
*   `website` (string): Your business’s website URL.
*   `opt_in_info` (string): Information regarding opt-in procedures for your messaging service. EX: “Customers must explicitly consent on our website and during the phone call.”
*   `messageSamples` (array): An array of three strings, each a sample message you plan to use.
*   `trusted_user` (object): An object containing details about the trusted user registering the brand. Includes `position`, `last_name`, `phone_number`, `first_name`, and `email`.

Ex. of trusted\_user obj:

Error Handling
--------------

Our API provides detailed error messages to help you understand what went wrong in case of a failure:

*   `400 Bad Request`: This response occurs if any required fields are missing in your request or if the state code is invalid. The response body will include a message specifying the missing or incorrect fields.
*   `500 Internal Server Error`: Indicates an unexpected error on the server side. The response body will contain an error message with more details.

Successful Response
-------------------

A successful request returns a `200 OK` status code with a JSON body containing a message indicating the registration was successful and any relevant data or identifiers related to the A2P brand registration.

_**Important**_\* The Brand Registration can take several attempts and days to weeks to complete. This success only indicates we _submitted_ the registration correctly.</content>
</page>

<page>
  <title>Update SMS Number - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/sms-number-update</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#body)

Body

[​](#param-phone-number)

phone\_number

string

The phone number to update.

[​](#param-prompt)

prompt

string

The prompt for the AI to use when replying.

[​](#param-ignore-keywords)

ignore\_keywords

array

Pass in an array of strings, that if present, the AI should not respond to. Set to `null` to disable.

[​](#param-temperature)

temperature

number

The temperature for prompt and underlying model.</content>
</page>

<page>
  <title>SMS Conversation Analysis - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/sms-analyze</url>
  <content>SMS

Answer questions and extract information from an SMS conversation.

POST

/

v1

/

sms

/

analyze

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#body)

Body

[​](#param-goal)

goal

string

required

An overarching goal for the information you want to extract from the SMS messages.

[​](#param-answers)

answers

array

required

An array of questions that you want the AI to answer, along with their return types.

For example:

    {
        "answers": [
            [ "When does Bob want to move?", "time" ],
            [ "Summarize the call.", "summary" ]
        ]
    }
    

[​](#param-to)

to

string

required

The phone number that received the messages.

[​](#param-from)

from

string

required

The human/other phone number in the conversation.

[Clear SMS Conversation](https://docs.bland.ai/api-v1/post/sms-clear)[Get SMS Messages](https://docs.bland.ai/api-v1/post/sms-get-messages)</content>
</page>

<page>
  <title>Update SMS Webhook - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/sms-webhook-update</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

SMS

Update the webhook for a given phone number.

POST

/

v1

/

sms

/

webhook

/

update

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#body)

Body

[​](#param-phone-number)

phone\_number

string

The phone number to update.

[​](#param-webhook)

webhook

string

The webhook to fire when an SMS is received.

[Toggle SMS Reply Method](https://docs.bland.ai/api-v1/post/sms-toggle-human)[List Prompts](https://docs.bland.ai/api-v1/get/prompts)</content>
</page>

<page>
  <title>Toggle SMS Reply Method - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/sms-toggle-human</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

SMS

Turn on or off the AI replying for a given phone number.

POST

/

v1

/

sms

/

toggle

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#body)

Body

[​](#param-phone-number)

phone\_number

string

The phone number to update.

[​](#param-on)

on

boolean

Turn human mode on or off.

`true` means that the AI will _not_ reply. `false` means the AI will reply

[Get SMS Messages](https://docs.bland.ai/api-v1/post/sms-get-messages)[Update SMS Webhook](https://docs.bland.ai/api-v1/post/sms-webhook-update)</content>
</page>

<page>
  <title>Retrieve Batch Analysis - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/batches-id-analysis</url>
  <content>Your API key for authentication.

### Path Parameters

The unique identifier for the call batch. Returned in the response when creating a batch, or when listing all batches.

### Response

Whether the request was successful or not. Possible values are `success` and `error`.

An error message or confirmation that the request was successful.

An array of analysis objects, each corresponding to a call within the batch.

Each analysis object includes:

*   `call_id`,
*   `batch_id`
*   `goal`
*   `answers` - the results of the AI analysis
*   `questions` - the original questions asked by the AI</content>
</page>

<page>
  <title>Get SMS Messages - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/sms-get-messages</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

SMS

Get the list of SMS messages for a given conversation.

POST

/

v1

/

sms

/

messages

/

get

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#body)

Body

[​](#param-to)

to

string

The `to` number in the conversation. This is the number you _do not_ own.

[​](#param-from)

from

string

The `from` number in the conversation. This is the number you _do_ own.

**Please note any ordering of numbers will work**

[SMS Conversation Analysis](https://docs.bland.ai/api-v1/post/sms-analyze)[Toggle SMS Reply Method](https://docs.bland.ai/api-v1/post/sms-toggle-human)</content>
</page>

<page>
  <title>Create Prompt - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/prompts</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

Prompts

Create and store a prompt for future use.

POST

/

v1

/

prompts

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#body)

Body

[​](#param-prompt)

prompt

string

required

Prompt to store.

[​](#param-name)

name

string

Name of prompt you want to store as reference.

### 

[​](#response)

Response

Prompt object.

Prompt to store.

Name of prompt you want to store as reference.

[Prompt Details](https://docs.bland.ai/api-v1/get/prompts-id)[Account Details](https://docs.bland.ai/api-v1/get/me)</content>
</page>

<page>
  <title>List Prompts - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/prompts</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

Prompts

Retrieves all your saved prompts.

GET

/

v1

/

prompts

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#response)

Response

[​](#param-status)

status

string

Response status of the request.

[​](#param-prompts)

prompts

array

An array of prompt objects.

[Update SMS Webhook](https://docs.bland.ai/api-v1/post/sms-webhook-update)[Prompt Details](https://docs.bland.ai/api-v1/get/prompts-id)</content>
</page>

<page>
  <title>Prompt Details - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/prompts-id</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-prompt-id)

prompt\_id

string

required

The unique identifier for the prompt you want to retrieve.

### 

[​](#response)

Response

[​](#param-status)

status

string

Response status of the request.

[​](#param-prompt)

prompt

object

An object containing parameters for the prompt.

[​](#param-prompt-id)

prompt.id

string

The unique identifier of the prompt.

[​](#param-prompt-prompt)

prompt.prompt

string

The prompt of the specific prompt\_id.

[​](#param-prompt-name)

prompt.name

string

The name of the specific prompt\_id.

[​](#param-prompt-last-updated)

prompt.last\_updated

string

The time of last update for the specific prompt\_id.</content>
</page>

<page>
  <title>Custom Twilio Integration - Bland AI</title>
  <url>https://docs.bland.ai/enterprise-features/custom-twilio</url>
  <content>Overview
--------

Enterprise customers can connect their own Twilio account to Bland. Easily bring over your existing phone numbers, integrations, and more.

Pre-requisites:

*   Your own Twilio account

Step 1: Creating an Encrypted Key with your Twilio Credentials
--------------------------------------------------------------

1.  Go to your [Twilio Console](https://www.twilio.com/console) and get your Account SID and Auth Token.
2.  Create an `encrypted_key` by [sending an API request](https://docs.bland.ai/api-v1/post/accounts) to Bland.

This is the only time that your `encrypted_key` will be returned to you. Make sure to store it securely, and new keys will need to be generated if lost.

Step 2: Using the Encrypted Key in Outbound Calls
-------------------------------------------------

Include `encrypted_key` in the headers (in addition to the `Authorization` header) of your API requests, and we’ll use that account’s credentials to make the call.

For example:

Note:

*   You can set your `from` number in the API request - this will need to be a number owned by that Twilio account (and not one purchased through Bland).
*   By default, we’ll send calls from a randomly selected number in the specified Twilio account if a `from` is not specified.

Step 3: Uploading Inbound numbers
---------------------------------

1.  Go to your [Twilio Console](https://www.twilio.com/console) and get your Twilio phone number(s).
2.  Upload your numbers [through the API](https://docs.bland.ai/api-v1/post/inbound-insert).

We’ll validate that these numbers are owned by that account and add them to your Bland account.

Step 4: Configuring Inbound Numbers/Webhooks
--------------------------------------------

Note: When updating inbound numbers, the headers need to include the `encrypted_key` in addition to the `Authorization` header. Doing so makes sure the updates are applied to the correct Twilio account.

Once you update an inbound number through the [Dev Portal](https://app.bland.ai/) or [API](https://docs.bland.ai/api-v1/post/inbound-number-update), that number will be automatically configured to run on Bland’s infrastructure. No additional steps are required!</content>
</page>

<page>
  <title>Account Details - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/me</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#response)

Response

[​](#param-billing)

billing

object

An object containing your billing data. Contains `current_balance` (number of credits), and `refill_to` if you have auto refill enabled.

[​](#param-status)

status

string

The status of your account.

[​](#param-total-calls)

total\_calls

int

The total number of calls you’ve made.</content>
</page>

<page>
  <title>Move Pathway - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/move-pathway-folder</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#body-parameters)

Body Parameters

[​](#param-pathway-id)

pathway\_id

string

required

The ID of the pathway to move.

[​](#param-folder-id)

folder\_id

string

The ID of the destination folder. If null, the pathway will be moved to the root level.

### 

[​](#response)

Response

[​](#param-pathway-id-1)

pathway\_id

string

The ID of the moved pathway.

[​](#param-old-folder-id)

old\_folder\_id

string

The ID of the original folder.

[​](#param-new-folder-id)

new\_folder\_id

string

The ID of the new folder, or null if moved to root level.</content>
</page>

<page>
  <title>Batch Details - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/batches-id</url>
  <content>Your API key for authentication.

### Path Parameters

The unique identifier for the batch of calls you want to retrieve.

### Query Parameters

Whether or not to include individual call data in the response.

If calls are included, can be set to false to exclude transcripts from the response.

If calls are included, can be set to false to exclude analysis from the response.

### Response

The status of the batch. Possible values are `in-progress` and `completed`.

*   `in-progress`: The batch is still in progress.
*   `completed`: Every call in the batch has completed.

An object containing parameters and settings for the batch.

The unique identifier of the batch - used as the `batch_id` parameter in other API calls.

The creation timestamp of the batch.

The label or description of the batch.

The base prompt used for calls in this batch.

batch\_params.endpoint\_code

The endpoint code used for API integration.

An object containing parameters for the calls in the batch.

An object containing analysis data for the batch.

The total number of calls in the batch, including completed and in-progress calls.

The total number of completed calls in the batch.

analysis.in\_progress\_calls

The total number of in-progress calls in the batch.

An object containing the number of calls in each queue status.

Example:

Contains `average`, `average_nonzero`, `summary` and `all` fields.

*   `average`: The average call length in minutes.
*   `average_nonzero`: The average call length in minutes, excluding calls with a length of less than one second.
*   `summary`: A summary of the call lengths, grouped into ranges.
*   `all`: Contains each call length, in case you want to use a different grouping than the default.

Contains each `call_id` in the batch.

Contains any error messages that calls in the batch may have.

Example:

Contains the number of calls that have been sent to each endpoint. Applicable only to API integrations.

An array of objects, each representing individual call data.

The timestamp when the individual call was created.

The phone number the call was made to.

The phone number the call was made from.

Indicates if the call was completed.

The unique identifier for each individual call.

The duration of the call in minutes.

Contains a string value if the batch had `answered_by_enabled` set to true.

Values:

*   `voicemail`
*   `human`
*   `unknown`
*   `no-answer`
*   `null`</content>
</page>

<page>
  <title>Create Pathway Chat - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/pathway-chat-create</url>
  <content>Create an instance of a pathway chat, which can be used to send and receive messages to the pathway.

### Headers

Your API key for authentication.

### Body

Pathway ID of the pathway to create a chat instance for.

The start node ID of the pathway.

### Response

The ID of the chat instance created. This will be used to send and receive messages to the pathway via the /pathway/chat endpoint.

If the status is `success`, the message will say “Chat instance created successfully.” Otherwise, if the status is `error`, the message will say “Error creating chat instance.”</content>
</page>

<page>
  <title>Dynamic Data - Bland AI</title>
  <url>https://docs.bland.ai/tutorials/dynamic-data</url>
  <content>Introduction
------------

With Dynamic Data, you can make external API requests at the start and throughout your phone call. This allows you to load data from your database, or from any other API. You can then use that data in your AI responses, or to define circumstantial behavior for each call.

Some examples of what Dynamic Data enables:

*   Maintain conversation history between calls
*   Define behavior based on the user’s location
*   Handle real-time data like status updates or prices

We’ll cover the following features in this section:

*   System variables
*   External API requests
*   Extracting data from responses
*   Variables as parameters
*   Chaining requests

System Variables
----------------

Variables are defined with double curly braces, like `{{variable}}`. System variables are predefined variables that are available in every AI phone call. You can use them to access information about the current call, like the user’s phone number or the current time.

Note: Variables are NOT case sensitive, and outer spaces are trimmed automatically.

Base variables:

*   `{{phone_number}}` - Always the other party’s number
*   `{{country}}` - The country code (ex. US)
*   `{{state}}` - The state or province’s abbreviation (ex. CA for California)
*   `{{city}}` - The full city name, capitalized
*   `{{zip}}` - The zip code
*   `{{call_id}}` - The unique ID of the current call
*   `{{now}}`
*   `{{now_utc}}`
*   `{{from}}` - The outbound number in E.164 format
*   `{{to}}` - The inbound number in E.164 format
*   `{{short_from}}` - outbound number with country code removed
*   `{{short_to}}` - inbound number with country code removed

Variables can be used mid-sentence, like this:

External API Requests
---------------------

External API requests are defined in the `dynamic_data` parameter of your call request or inbound agent configuration. The `dynamic_data` parameter is an array of objects, where each object represents an API request.

Here’s a simple request that can be used to load public data about the current price of Bitcoin, then store it in a variable called `{{bitcoin_price}}`:

Rather than using the full response, you can extract specific data from the response using the `data` parameter. The `data` parameter follows JSON structuring, using dot notation and array indices. For example, if the response is:

Then `$.bpi.USD.rate` would return `9,000.00`.

More complex filters can be used if they follow the [JSONPath format](https://docs.hevodata.com/sources/engg-analytics/streaming/rest-api/writing-jsonpath-expressions).

Variables as Parameters
-----------------------

Once defined with `response_data`, variables can be used nearly anywhere.

*   In the `task` or `prompt` parameters
*   In the `context` parameter of `response_data`
*   In the `body`, `headers` and/or `query` parameter of each request

Afterwards, in your webhooks and when retrieving call transcripts, the `variables` field will contain all variables that were defined during the call.

By far, the easiest way to test out your `dynamic_data` configuration is via the [/dynamic\_data/test](https://docs.bland.ai/api-reference/endpoint/dynamic_validate) endpoint. It returns the original configuration, every raw response, and the final variables after parsing is applied.

Chaining Requests
-----------------

Each request is executed in order, and variables defined in previous requests can be used in the next request. For example, if you want to retrieve information from your database or ours, then take additional actions with that data then you could do something like the following:

For this example, imagine a delivery service that offers instant checkout for customers that have signed up to be a member. The first request retrieves their member\_id from your database like so:

We just created that `{{member_id}}` variable - now we can use it in the next request.

This delivery service also can be called to check on an order status.

Note a difference: The `cache` parameter is set to `false`, so if the order status changes during the call, the agent will immediately know about it and be able to inform the customer.</content>
</page>

<page>
  <title>Create Folder - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/create_pathway_folder</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#body-parameters)

Body Parameters

[​](#param-name)

name

string

required

The name of the new folder.

[​](#param-parent-folder-id)

parent\_folder\_id

string

The ID of the parent folder, if creating a subfolder.

### 

[​](#response)

Response

[​](#param-folder-id)

folder\_id

string

The unique identifier of the newly created folder.

[​](#param-name-1)

name

string

The name of the newly created folder.

[​](#param-parent-folder-id-1)

parent\_folder\_id

string

The ID of the parent folder, if applicable.</content>
</page>

<page>
  <title>Update Folder - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/update_pathway_folder</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-folder-id)

folder\_id

string

required

The ID of the folder to update.

### 

[​](#body-parameters)

Body Parameters

[​](#param-name)

name

string

required

The new name for the folder.

### 

[​](#response)

Response

[​](#param-folder-id-1)

folder\_id

string

The unique identifier of the updated folder.

[​](#param-name-1)

name

string

The updated name of the folder.

[​](#param-parent-folder-id)

parent\_folder\_id

string

The ID of the parent folder, if applicable.</content>
</page>

<page>
  <title>Get All Folders - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/pathway_folders</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#response)

Response

[​](#param-folders)

folders

array

An array of folder objects.

[​](#param-folders-id)

folders\[\].id

string

The unique identifier of the folder.

[​](#param-folders-name)

folders\[\].name

string

The name of the folder.

[​](#param-folders-parent-folder-id)

folders\[\].parent\_folder\_id

string

The ID of the parent folder, if applicable.</content>
</page>

<page>
  <title>Delete Folder - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/delete/pathway_folder</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
*   Pathway Versions
    
*   Pathway Folders
    
    *   [GET
        
        Get All Folders
        
        
        
        ](https://docs.bland.ai/api-v1/get/pathway_folders)
    *   [GET
        
        Get Pathways in Folder
        
        
        
        ](https://docs.bland.ai/api-v1/get/folder_pathways)
    *   [POST
        
        Create Folder
        
        
        
        ](https://docs.bland.ai/api-v1/post/create_pathway_folder)
    *   [DEL
        
        Delete Folder
        
        
        
        ](https://docs.bland.ai/api-v1/delete/pathway_folder)
    *   [PATCH
        
        Update Folder
        
        
        
        ](https://docs.bland.ai/api-v1/post/update_pathway_folder)
    *   [POST
        
        Move Pathway
        
        
        
        ](https://docs.bland.ai/api-v1/post/move-pathway-folder)

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

Pathway Folders

Deletes a specific folder for the authenticated user. The folder must be empty to be deleted.

DELETE

/

v1

/

pathway

/

folders

/

{folder\_id}

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-folder-id)

folder\_id

string

required

The ID of the folder to delete.

### 

[​](#response)

Response

[​](#param-folder-id-1)

folder\_id

string

The ID of the deleted folder.

[Create Folder](https://docs.bland.ai/api-v1/post/create_pathway_folder)[Update Folder](https://docs.bland.ai/api-v1/post/update_pathway_folder)</content>
</page>

<page>
  <title>Get Pathways in Folder - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/folder_pathways</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-folder-id)

folder\_id

string

required

The ID of the folder to retrieve pathways from.

### 

[​](#response)

Response

[​](#param-pathways)

pathways

array

An array of pathway objects within the specified folder.

[​](#param-pathways-id)

pathways\[\].id

string

The unique identifier of the pathway.

[​](#param-pathways-name)

pathways\[\].name

string

The name of the pathway.

[​](#param-pathways-description)

pathways\[\].description

string

The description of the pathway.

[​](#param-pathways-created-at)

pathways\[\].created\_at

string

The creation date and time of the pathway.</content>
</page>

<page>
  <title>Pathway Chat - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/pathway-chat</url>
  <content>Your API key for authentication.

### Path Parameters

The chat ID created from the /pathway/chat/create endpoint.

### Body

The message to send to the pathway (optional)

### Response

The ID of the chat instance created. This will be used to send and receive messages to the pathway via the /pathway/chat endpoint.

The response from the Assistant to the message sent.

The ID of the current node in the pathway.

The name of the current node in the pathway.

An array of objects containing the role and content of each message in the chat.

The ID of the pathway the chat is associated with.</content>
</page>

<page>
  <title>Enterprise rate limits - Bland AI</title>
  <url>https://docs.bland.ai/api-reference/endpoint/dynamic_validate</url>
  <content>By default, Bland customers can dispatch 1000 calls/day before hitting rate limits.

Enterprise customers start at 20,000 calls per hour, and 100,000 calls per day.

To raise your rate limits or discuss limits larger than what’s offered on enterprise, reach out [here](https://forms.default.com/361589).</content>
</page>

<page>
  <title>Delete Pathway Version - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/delete/pathway_version</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-pathway-id)

pathway\_id

string

required

The ID of the pathway containing the version to be deleted.

[​](#param-version-id)

version\_id

string

required

The ID of the version to be deleted.

### 

[​](#response)

Response

[​](#param-status)

status

string

The status of the operation (e.g., “success”).

[​](#param-message)

message

string

A message describing the result of the operation.</content>
</page>

<page>
  <title>Pathway Chat - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/pathway-chat</url>
  <content>*   [Community & Support](https://discord.gg/QvxDz8zcKe)
*   [Blog](https://www.bland.ai/blog)
*   [Enterprise inquiries](https://forms.default.com/361589)

##### Basic Tutorials

*   [POST
    
    Send Call using Pathways (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple-pathway)
*   [POST
    
    Send Call With Task (Simple)
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-simple)

##### Calls

*   [POST
    
    Send Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls)
*   [POST
    
    Analyze Call with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-analyze)
*   [POST
    
    Stop Active Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-id-stop)
*   [POST
    
    Stop All Active Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/calls-active-stop)
*   [GET
    
    List Calls
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls)
*   [GET
    
    Call Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id)
*   [GET
    
    Event Stream
    
    
    
    ](https://docs.bland.ai/api-v1/get/event-stream)
*   [GET
    
    Audio Recording
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-id-recording)
*   [GET
    
    Get corrected transcripts
    
    
    
    ](https://docs.bland.ai/api-v1/get/calls-corrected-transcript)

##### Intelligence

*   [POST
    
    Analyze Call Emotions
    
    
    
    ](https://docs.bland.ai/api-v1/post/intelligence-emotion-analysis)

##### Conversational Pathways

*   [GET
    
    Get All Pathways Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/all_pathway)
*   [GET
    
    Get Single Pathway Information
    
    
    
    ](https://docs.bland.ai/api-v1/get/pathway)
*   [POST
    
    Create Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/pathways)
*   [POST
    
    Update Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/update_pathways)
*   [DEL
    
    Delete Pathway
    
    
    
    ](https://docs.bland.ai/api-v1/post/delete_pathway)
*   Pathway Chat
    
    *   [POST
        
        Create Pathway Chat
        
        
        
        ](https://docs.bland.ai/api-v1/post/pathway-chat-create)
    *   [POST
        
        Pathway Chat
        
        
        
        ](https://docs.bland.ai/api-v1/post/pathway-chat)
    *   [GET
        
        Pathway Chat
        
        
        
        ](https://docs.bland.ai/api-v1/get/pathway-chat)
*   Pathway Versions
    
*   Pathway Folders
    

##### Vector Knowledge Bases

*   [POST
    
    Create a Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/post/vectors)
*   [POST
    
    Upload Media
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-media)
*   [POST
    
    Upload Text
    
    
    
    ](https://docs.bland.ai/api-v1/post/upload-text)
*   [PATCH
    
    Update Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/patch/vectors-id)
*   [GET
    
    List Knowledge Bases
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors)
*   [GET
    
    List Knowledge Base Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/vectors-id)
*   [DEL
    
    Delete Knowledge Base
    
    
    
    ](https://docs.bland.ai/api-v1/delete/vectors-id)

##### Numbers

*   [POST
    
    Purchase Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-purchase)
*   [POST
    
    Update Inbound Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-update)
*   [GET
    
    List Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound)
*   [GET
    
    Number Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/inbound-number)

##### Voices

*   [POST
    
    Clone a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices)
*   [PATCH
    
    Rename a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/patch/voices-id)
*   [DEL
    
    Delete a Voice
    
    
    
    ](https://docs.bland.ai/api-v1/delete/voices-id)
*   [GET
    
    List Voices
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices)
*   [GET
    
    Voice Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/voices-id)
*   [POST
    
    Publish Cloned Voice
    
    
    
    ](https://docs.bland.ai/api-v1/post/voiceId-publish)
*   [POST
    
    Generate Audio Sample
    
    
    
    ](https://docs.bland.ai/api-v1/post/voices-id-sample)

##### Custom Tools

*   [POST
    
    Create a Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools)
*   [POST
    
    Update Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/post/tools-tool-id)
*   [DEL
    
    Delete Custom Tool
    
    
    
    ](https://docs.bland.ai/api-v1/delete/tools-tool-id)
*   [GET
    
    List Custom Tools
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools)
*   [GET
    
    Custom Tool Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/tools-tool-id)

##### Web Agents

*   [POST
    
    Create a Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents)
*   [POST
    
    Update Web Agent Settings
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id)
*   [POST
    
    Authorize a Web Agent Call
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-authorize)
*   [POST
    
    Delete Web Agent
    
    
    
    ](https://docs.bland.ai/api-v1/post/agents-id-delete)
*   [GET
    
    List Web Agents
    
    
    
    ](https://docs.bland.ai/api-v1/get/agents)

##### Custom Twilio Accounts

*   [POST
    
    Create Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts)
*   [POST
    
    Delete Encrypted Key
    
    
    
    ](https://docs.bland.ai/api-v1/post/accounts-delete)
*   [POST
    
    Upload Inbound Phone Numbers
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-insert)
*   [POST
    
    Delete Inbound Phone Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/inbound-number-delete)

##### Batches

*   [POST
    
    Send a Batch of Calls
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches)
*   [POST
    
    Analyze Batch with AI
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-analyze)
*   [POST
    
    Stop Active Batch
    
    
    
    ](https://docs.bland.ai/api-v1/post/batches-id-stop)
*   [GET
    
    List Batches
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches)
*   [GET
    
    Batch Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id)
*   [GET
    
    Retrieve Batch Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/get/batches-id-analysis)

##### SMS

*   [POST
    
    A2P Registration
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-submit-reg)
*   [POST
    
    Check SMS A2P status
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-check-registration)
*   [POST
    
    Update SMS Number
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-number-update)
*   [POST
    
    Clear SMS Conversation
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-clear)
*   [POST
    
    SMS Conversation Analysis
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-analyze)
*   [POST
    
    Get SMS Messages
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-get-messages)
*   [POST
    
    Toggle SMS Reply Method
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-toggle-human)
*   [POST
    
    Update SMS Webhook
    
    
    
    ](https://docs.bland.ai/api-v1/post/sms-webhook-update)

##### Prompts

*   [GET
    
    List Prompts
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts)
*   [GET
    
    Prompt Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/prompts-id)
*   [POST
    
    Create Prompt
    
    
    
    ](https://docs.bland.ai/api-v1/post/prompts)

##### Account

*   [GET
    
    Account Details
    
    
    
    ](https://docs.bland.ai/api-v1/get/me)

Pathway Chat

Get conversation history for a pathway chat.

GET

/

v1

/

pathway

/

chat

/

{id}

### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-id)

id

uuid

required

The chat ID created from the /pathway/chat/create endpoint.

### 

[​](#response)

Response

[​](#param-errors)

errors

array

List of errors or null.

[​](#param-data)

data

array

Message objects for the conversation history.

[Pathway Chat](https://docs.bland.ai/api-v1/post/pathway-chat)[Get Pathway Versions](https://docs.bland.ai/api-v1/get/pathway_versions)</content>
</page>

<page>
  <title>Promote Pathway Version - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/pathway-promote</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path)

Path

[​](#param-pathway-id)

pathway\_id

string

required

The ID of the pathway you want to promote

### 

[​](#body)

Body

[​](#param-version-id)

version\_id

number

required

The version number of the pathway you want to promote

[​](#param-environment)

environment

string

The environment you want to promote the pathway to. Can be `production` or `staging`. Default is `production`.

### 

[​](#response)

Response

[​](#param-message)

message

string

A message indicating the status of the request.</content>
</page>

<page>
  <title>Get Pathway Versions - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/pathway_versions</url>
  <content>### 

[​](#headers)

Headers

[​](#param-authorization)

authorization

string

required

Your API key for authentication.

### 

[​](#path-parameters)

Path Parameters

[​](#param-pathway-id)

pathway\_id

string

required

The ID of the pathway for which to retrieve versions.

### 

[​](#response)

Response

[​](#param-id)

id

string

The unique identifier of the pathway version.

[​](#param-version-number)

version\_number

integer

The version number of this pathway version.

[​](#param-created-at)

created\_at

string

The timestamp when this version was created.

[​](#param-name)

name

string

The name of this pathway version.

[​](#param-is-latest)

is\_latest

boolean

Indicates whether this is the latest version of the pathway.</content>
</page>

<page>
  <title>Update Pathway Version - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/update-pathway-version</url>
  <content>Updates a specific version of a pathway, including its version name, nodes, and edges.

### Headers

Your API key for authentication.

### Path Parameters

The ID of the pathway for which to create a new version.

The version number of the pathway to update.

### Request Body

The name of the new pathway version.

An array of node objects defining the structure of the pathway.

An array of edge objects defining the connections between nodes.

### Response

The status of the operation (e.g., “success”).

A message describing the result of the operation.</content>
</page>

<page>
  <title>Create Pathway Version - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/post/create_pathway_version</url>
  <content>Your API key for authentication.

### Path Parameters

The ID of the pathway for which to create a new version.

### Request Body

The name of the new pathway version.

An array of node objects defining the structure of the pathway.

An array of edge objects defining the connections between nodes.

### Response

The status of the operation (e.g., “success”).

A message describing the result of the operation.

The timestamp when the new version was created.

The unique identifier of the newly created version.

The name of the newly created version.

The version number of the newly created version.</content>
</page>

<page>
  <title>Get Specific Pathway Version - Bland AI</title>
  <url>https://docs.bland.ai/api-v1/get/pathway_version</url>
  <content>Retrieves a specific version of a pathway, including its name, nodes, edges, version number, and latest status.

GET

/

v1

/

pathway

/

{pathway\_id}

/

version

/

{version\_id}

### Headers

Your API key for authentication.

### Path Parameters

The ID of the version to retrieve. Use 0 for the live pathway.

### Response

The name of the pathway version.

Data about all the nodes in the pathway version.

*   `id` — Unique identifier of the node
*   `type` — Type of the node (e.g., “Default”, “End Call”, “Webhook”)
*   `data` — Object containing node-specific data
    *   `name` — Name of the node
    *   `text` or `prompt` — Text or prompt associated with the node
    *   Other properties specific to the node type

Data about all the edges in the pathway version.

*   `id` — Unique identifier of the edge
*   `source` — ID of the source node
*   `target` — ID of the target node
*   `label` — Label for this edge

The version number of this pathway version.

Indicates whether this is the latest version of the pathway.</content>
</page>