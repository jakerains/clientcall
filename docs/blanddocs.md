Title: Send Call - Bland AI

URL Source: http://docs.bland.ai/api-v1/post/calls

Markdown Content:
Overview
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

Example: