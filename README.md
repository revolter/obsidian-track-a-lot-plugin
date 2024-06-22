# Track-a-Lot Plugin

![Obsidian plugin downloads badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fscambier.xyz%2Fobsidian-endpoints%2Ftrack-a-lot.json)

This is a tracker plugin for Obsidian (https://obsidian.md).

It scrapes different webpages, builds lists with the items, and allows you to
individually track their status.

The lists are created as Markdown tables. You can write anything in the status
column, and it will be preserved when you update the list.

![screenshot](images/screenshot.png)

## Settings

- Open `Settings` > `Track-a-Lot`
- Enable the required tracking recipe

## Usage

- Create or select a note
- Make sure the note is in editing mode
  (https://help.obsidian.md/Editing+and+formatting/Edit+and+preview+Markdown)
- Open the `Command palette` (https://help.obsidian.md/Plugins/Command+palette)
- Search for the `Track-a-Lot` command for the respective list (e.g.
  `Track-a-Lot: Update Hanayama Huzzles list`)
- Press <kbd>Enter</kbd>

## Contributing

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

## License

[MIT](LICENSE)
