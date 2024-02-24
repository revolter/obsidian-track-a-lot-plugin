export class RegexFactory {
	imageMarkdownLinkRegex(): RegExp {
		return new RegExp(/!\[[^\]]+\]\((?<link>[^)]+)(?=\))/g); // https://regex101.com/r/YlCOgc/2
	}
}
