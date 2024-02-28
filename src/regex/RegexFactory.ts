export class RegexFactory {
	imageMarkdownLinkRegex(): RegExp {
		return new RegExp(/!\[[^\]]+\]\((?<link>[^)]+)(?=\))/); // https://regex101.com/r/YlCOgc/3
	}
}
