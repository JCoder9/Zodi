import { Component, OnInit } from '@angular/core';
import { CartService } from '@zodi/libs/orders';

@Component({
  selector: 'zodi-messages',
  templateUrl: './messages.component.html',
  styles: [
    `
      .messages-container {
        position: fixed;
        top: 80px;
        right: 1rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 400px;
      }

      .message {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-left: 4px solid;
        animation: slideIn 0.3s ease-out;
      }

      .message--success {
        border-left-color: #4caf50;
      }
      .message--error {
        border-left-color: #f44336;
      }
      .message--info {
        border-left-color: #2196f3;
      }
      .message--warning {
        border-left-color: #ff9800;
      }

      .message-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
      }

      .message-content i {
        font-size: 1.1rem;
      }

      .message--success .message-content i {
        color: #4caf50;
      }
      .message--error .message-content i {
        color: #f44336;
      }
      .message--info .message-content i {
        color: #2196f3;
      }
      .message--warning .message-content i {
        color: #ff9800;
      }

      .message-text {
        font-weight: 500;
        color: #333;
      }

      .message-close {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background-color 0.2s ease;
      }

      .message-close:hover {
        background-color: #f5f5f5;
        color: #666;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @media (max-width: 640px) {
        .messages-container {
          left: 1rem;
          right: 1rem;
          max-width: none;
        }
      }
    `,
  ],
})
export class MessagesComponent implements OnInit {
  messages: { type: string; text: string; id: number }[] = [];
  nextId = 1;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(() => {
      this.showMessage('success', 'Product added to cart successfully!');
    });
  }

  showMessage(type: string, text: string): void {
    const message = { type, text, id: this.nextId++ };
    this.messages.push(message);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      this.removeMessage(message.id);
    }, 3000);
  }

  removeMessage(id: number): void {
    this.messages = this.messages.filter((m) => m.id !== id);
  }

  trackByMessage(index: number, message: any): number {
    return message.id;
  }
}
