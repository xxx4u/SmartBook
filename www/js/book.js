
function Book(data) {
    this.poster = data['uid'];
    this.title = data['title'];
    this.authors = data['author'];
    this.isbnTen = data['isbnTen'];
    this.isbnThir = data['isbnThir'];
    this.price = data['price'];
    this.posters = new Array();
}

Book.prototype.build = function() {
    var box = jQuery(document.createElement('div'));
    box.attr({ 'class':'result-box' });
    
    var titleDiv = jQuery(document.createElement('div'));
    titleDiv.attr({ 'class':'result-title' });
    titleDiv.html(this.title);
    
    var authorDiv = jQuery(document.createElement('div'));
    authorDiv.attr({ 'class':'result-author' });
    authorDiv.html('Author(s): ' + this.authors);
    
    var isbn10 = jQuery(document.createElement('div'));
    isbn10.attr({ 'class':'result-isbn' });
    isbn10.html('ISBN-10: ' + this.isbnTen);
    
    var isbn13 = jQuery(document.createElement('div'));
    isbn13.attr({ 'class':'result-isbn' });
    isbn13.html('ISBN-13: ' + this.isbnThir);
    
    var arrow = jQuery(document.createElement('div'));
    arrow.attr({ 'class':'arrow-right' });
    
    var postersDiv = jQuery(document.createElement('div'));
    postersDiv.attr({ 'class':'result-posters', 'amount':this.posters.length });
    
    
    for(var i = 0; i < this.posters.length; ++i) {
        var post = jQuery(document.createElement('div'));
        post.attr({ 'class':'result-post' });
        
        var spanRight = jQuery(document.createElement('span'));
        spanRight.css({ 'float':'right', 'margin-right':'3%' });
        
        spanRight.html('$' + this.posters[i].price);
        
        var spanLeft = jQuery(document.createElement('span'));
        spanLeft.css({ 'float':'left', 'margin-left':'3%' });
        spanLeft.html(this.posters[i].uid);
        
        post.append(spanLeft, spanRight);
        postersDiv.append(post);
    }
    
    box.bind('click', function() {
             if(postersDiv.height() > 0) {
                postersDiv.css({ 'height':'0' });
             } else {
                postersDiv.css({ 'height': (postersDiv.attr('amount') * 30) + 'px' });
             }
             });
    
    box.append(titleDiv, authorDiv, isbn10, isbn13, arrow, postersDiv);
    
    jQuery('#search-container').append(box);
}