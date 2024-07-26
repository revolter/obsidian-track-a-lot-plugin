# Obsidian Track-a-Lot Plugin

![Obsidian plugin downloads badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fscambier.xyz%2Fobsidian-endpoints%2Ftrack-a-lot.json)

This is a tracker plugin for Obsidian (https://obsidian.md).

It scrapes different webpages, builds lists with the items, and allows you to
individually track their status.

The lists are created as Markdown tables. You can write anything in the status
column, and it will be preserved when you update the list.

![screenshot](images/screenshot.png)

## Settings

1. Open `Settings` > `Track-a-Lot`.
2. Enable the required tracking recipe.

## Usage

1. Create or select a note.
2. Make sure the note is in editing mode
  (https://help.obsidian.md/Editing+and+formatting/Edit+and+preview+Markdown).
3. Open the `Command palette` (https://help.obsidian.md/Plugins/Command+palette).
4. Search for the `Track-a-Lot` command for the respective list (e.g.
  `Track-a-Lot: Update Hanayama Huzzles list`).
5. Press <kbd>Enter</kbd>.

## Contributing

### Setup

1. Go to [settings/actions](../../settings/actions).
2. Enable `Read and write permissions` under `Workflow permissions`.
3. Click `Save`.

### Installation

1. Install `Node.js` by following the instructions from
   https://docs.npmjs.com/downloading-and-installing-node-js-and-npm.
2. Install the `Node.js` dependencies by running
   ```sh
   npm install
   ```

### Usage

```sh
npm run dev
```

### Releasing

1. Run `npm version <major/minor/patch>`.
2. Optionally add release notes to the created GitHub draft release.
3. Publish the GitHub draft release.

### Submitting

1. Follow the [official instructions](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin#Step+3+Submit+your+plugin+for+review).

## License

[MIT](LICENSE)
