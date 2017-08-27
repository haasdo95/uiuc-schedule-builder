export class Trie {
    private children: {[c: string]: Trie} = {};
    private hasStr: string = '';

    /**
     * Trie-ify
     * @param words
     */
    constructor(words: string[]) {
        for (const word of words) {
            this.insert(word);
        }
    }

    private insertHelper(word: string, index: number): void {
        if (index == word.length) { // base case
            this.hasStr = word;
            return;
        }
        const c = word[index];
        if (!this.children[c]) { // do not exist
            this.children[c] = new Trie([]);
        }
        this.children[c].insertHelper(word, index+1);
    }

    private insert(word: string): void {
        this.insertHelper(word, 0);
    }

    private getNodeWithPrefix(prefix: string): Trie {
        if (prefix.length == 0) return this;
        const node = this.children[prefix[0]];
        if (!node) return null;
        return node.getNodeWithPrefix(prefix.substring(1));
    }

    /**
     * Get all words under "this".
     */
    private getWordsWithNode(): string[] { 
        var result: string[] = [];
        if (this.hasStr) {
            result.push(this.hasStr);
        }
        for (const c in this.children) {
            const subResult = this.children[c].getWordsWithNode();
            for (const res of subResult) {
                result.push(res);
            }
        }
        return result;
    }

    getWordsWithPrefix(prefix: string): string[] {
        const node = this.getNodeWithPrefix(prefix);
        if (!node) return []; // not found
        return node.getWordsWithNode();
    }
}
