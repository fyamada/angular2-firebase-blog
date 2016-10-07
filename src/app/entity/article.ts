/**
 * Article entity is a representation of an article metadata in Firebase real time database.
 * @since: 0.1
 * @author: Fabio Yamada
 */
export class Article {
    /**
     *  Article file name in the storage
     */ 
    article: string;

    author: string;
    id: number;
    timestamp: string;
    title: string;
    content: string;
}