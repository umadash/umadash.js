export class UrlUtil {

    /**
     * you can get filename from url.
     * @param hasExtension 
     */
    public static getFileName(url: string, hasExtension: boolean = true) {
        if (hasExtension) {
            return url.match(".+/(.+?)([\?#;].*)?$")[1];
        }
        else {
            return url.match(".+/(.+?)\.[a-z]+([\?#;].*)?$")[1];
        }
    }

    public static getParam(key: string, url: string = null): string | null {
        if (!url) url = window.location.href;
        key = key.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + key + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

}