# BroadcastChannel API for speaker view synchronisation

The presentation window and speaker view are separate browser tabs that stay in sync via the BroadcastChannel API. The presentation window broadcasts slide navigation events; the speaker view listens and mirrors the current slide. No server, no WebSockets, no external state — works fully offline. localStorage events were considered but BroadcastChannel is the modern replacement for same-origin tab communication.
