import { App, Modal } from 'obsidian';

export class ConfirmModal extends Modal {
	constructor(
		app: App,
		private message: string,
		private onConfirm: () => void,
	) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl('h3', { text: 'Confirm' });
		contentEl.createEl('p', { text: this.message });

		const buttonContainer = contentEl.createDiv();
		buttonContainer.style.display = 'flex';
		buttonContainer.style.justifyContent = 'flex-end';
		buttonContainer.style.gap = '10px';
		buttonContainer.style.marginTop = '20px';

		const cancelBtn = buttonContainer.createEl('button', { text: 'Cancel' });
		cancelBtn.onclick = () => this.close();

		const confirmBtn = buttonContainer.createEl('button', { text: 'Confirm', cls: 'mod-warning' });
		confirmBtn.onclick = () => {
			this.onConfirm();
			this.close();
		};
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
