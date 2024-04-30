import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { CreateProjectView } from 'ui/CreateProject';

import { FtpMain } from 'ui/FtpMain';

import { CreatePassword } from 'ui/CreatePassword';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'amytools', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('Project Plugin of Obsidian');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a create command that can be triggered anywhere
		this.addCommand({
			id: 'project-ultra-create',
			name: 'Create project',
			callback: () => {
				new CreateProjectView(this.app).open();
			}
		});


		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'open-ftp',
			name: 'Open Ftp',
			callback: () => {
				new FtpMain(this.app).open();
			}
		});

		this.addCommand({
			id: 'create-password',
			name: 'Create a random password',
			callback: () => {
				new CreatePassword(this.app).open();
			}
		});

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl } = this;
		contentEl.createEl('h1', { text: 'Add New Project' });
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class CreateModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl } = this;
		contentEl.createEl('h1', { text: 'Add New Project' });
		let form = contentEl.createEl('form');

		let projectNameInput = form.createEl('p')
			.createDiv('1')
			.createEl('input', {
				type: 'text',
				placeholder: 'Project Name'
			});

		let projectDescInput = form.createEl('p')
			.createDiv('1')
			.createEl('input', {
				type: 'text',
				placeholder: 'Project Description'
			});

		form.createEl('button', { text: 'Save Project' }).addEventListener('click', (e) => {
			e.preventDefault();
			this.saveProject(projectNameInput.value, projectDescInput.value);
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	saveProject(name: string, description: string) {
		// 实现保存逻辑
		console.log('Project Saved:', name, description);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
