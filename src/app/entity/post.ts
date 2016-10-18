/**
 * Post entity is a representation of an post entry in Firebase real time database.
 * @since: 0.1
 * @author: Fabio Yamada
 */
export class Post {
    /**
     *  Post name in the storage
     */ 
    name: string;

    author: string;
    contentKey: string;
    timestamp: string;
    title: string;
    summary: string;
    content: string;
}