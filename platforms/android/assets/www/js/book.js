
function Book(data) {
    this.poster = data['uid'];
    this.title = data['title'];
    this.authors = data['author'];
    this.isbnTen = data['isbnTen'];
    this.isbnThir = data['isbnThir'];
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
    
    box.append(titleDiv, authorDiv, isbn10, isbn13, arrow);
    
    jQuery('#search-container').append(box);
}