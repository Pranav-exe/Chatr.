/**
 * Notification Sound Service
 * Handles audio playback while respecting browser autoplay policies by
 * "unlocking" the audio context on the first user interaction.
 */

class NotificationService {
  private audio: HTMLAudioElement | null = null;
  private isUnlocked: boolean = false;

  constructor(soundPath: string) {
    if (typeof window !== "undefined") {
      this.audio = new Audio(soundPath);
      this.audio.preload = "auto";
      this.setupUnlockListeners();
    }
  }

  private setupUnlockListeners() {
    const unlock = () => {
      if (this.isUnlocked || !this.audio) return;

      // Play and immediately pause to "unlock" the audio element
      this.audio
        .play()
        .then(() => {
          this.audio!.pause();
          this.audio!.currentTime = 0;
          this.isUnlocked = true;
          this.removeListeners();
        })
        .catch((err) => {
          // Promise rejection here is expected if user hasn't interacted yet
          console.debug("Audio unlock pending interaction...", err);
        });
    };

    window.addEventListener("click", unlock);
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock);
  }

  private removeListeners() {
    const events = ["click", "keydown", "touchstart"];
    events.forEach((event) => {
      window.removeEventListener(event, (this as any)[`unlock_${event}`]);
    });
  }

  /**
   * Plays the notification sound safely.
   * Logic: Only play if browser allows and service is initialized.
   */
  public async play(): Promise<void> {
    if (!this.audio) return;

    try {
      // Reset to beginning if already playing
      this.audio.currentTime = 0;
      await this.audio.play();
    } catch (error) {
      // Catching NotAllowedError or other issues to prevent unhandled promise rejections
      console.warn("Notification sound blocked or failed:", error);
    }
  }
}

// Import the sound asset
import notificationSound from "../assets/sounds/notification.mp3";

// Create a singleton instance
export const notificationService = new NotificationService(notificationSound);
