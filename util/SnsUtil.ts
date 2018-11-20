const $ = require('jquery');

export class SnsUtil {

    public static enable($facebook?: JQuery, $twitter?: JQuery, $hatena?: JQuery, $line?: JQuery): void {
        if ($facebook) this.setupFacebook($facebook);
        if ($twitter)  this.setupTwitter($twitter);
        if ($hatena)  this.setupHatena($hatena);
        if ($line)  this.setupLine($line);
    }

    public static openTwitterWindow(text: string, url: string, hashtags: string = ""): void {
        let shareUrl = "http://twitter.com/share?text=" + text + "&url=" + url;
        if (hashtags) {
            shareUrl += `&hashtags=${hashtags}`;
        }

        window.open(encodeURI(shareUrl), 'tweetwindow', 'width=650, height=470, personalbar=0, toolbar=0, scrollbars=1, sizable=1'); 
    }

    public static openFacebookWindow(url: string): void {
        const shareUrl = 'http://www.facebook.com/share.php?u=' + url;
        window.open(shareUrl,'FBwindow','width=650, height=450, menubar=no, toolbar=no, scrollbars=yes');
    }

    public static openHatena(url: string): void {
        const shareUrl: string = 'http://b.hatena.ne.jp/entry/' + url;
        window.open(shareUrl);
    }

    public static openLine(text: string, url: string): void {
        const shareUrl: string = `http://line.me/R/msg/text/?${text} ${url}`;
        window.open(shareUrl);
    }
        
    static setupHatena($target: JQuery): void {
        $target.on('click', function(e) {
            const $target = $(e.currentTarget);
            const url = $target.attr('data-url') || "";
            SnsUtil.openHatena(url);
        });
    }

    static setupFacebook($target: JQuery): void {
        $target.on('click', function(e) {
            const $target = $(e.currentTarget);
            const url = $target.attr('data-url') || "";
            SnsUtil.openFacebookWindow(url);
        });
    }

    private static setupTwitter($target: JQuery): void {
        $target.on('click', function(e) {
            const $target = $(e.currentTarget);
            const text = $target.attr('data-txt') || "";
            const url = $target.attr('data-url') || "";
            const hashtags = $target.attr('data-hashtags') || "";
            SnsUtil.openTwitterWindow(text, url, hashtags);
        });
    }

    static setupLine($target: JQuery): void {
        $target.on('click', function(e) {
            const $target = $(e.currentTarget);
            const text = $target.attr('data-txt') || "";
            const url = $target.attr('data-url') || "";
            SnsUtil.openLine(text, url);
        });
    }
}