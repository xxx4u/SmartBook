
function Core() {
    this.books = new Array();
}

Core.prototype.display = function() {
    jQuery('#search-container').html('');
    var unique = new Array();
    for(var i = 0; i < this.books.length; ++i) {
        var found = false;
        for(var j = 0; j < unique.length; ++j) {
            if(this.books[i].isbnTen == unique[j].isbnTen) {
                found = true;
            }
        }
        if(!found) {
            unique.push(this.books[i]);
        }
    }
    
    for(var i = 0; i < unique.length; ++i) {
        for(var j = 0; j < this.books.length; ++j) {
            if(this.books[j].isbnTen == unique[i].isbnTen) {
                var user = new User(this.books[j].poster, this.books[j].price);
                unique[i].posters.push(user);
            }
        }
    }
    
    for(var i = 0; i < unique.length; ++i) {
        unique[i].build();
    }
}

Core.prototype.loading = function() {
    jQuery('#search-container').html('<div id="loading-container"><div id="followingBallsG"><div id="followingBallsG_1" class="followingBallsG"></div><div id="followingBallsG_2" class="followingBallsG"></div><div id="followingBallsG_3" class="followingBallsG"></div><div id="followingBallsG_4" class="followingBallsG"></div></div></div>');
}

Core.prototype.load = function() {
    core.adduser();
    core.loading();
    var loadall = {
        type: 'GET',
        url: 'http://book.scydev.com/',
        dataType: 'JSON',
        success: function(data) {
            core.books.clear();
            for(var i = 0; i < data.length; ++i) {
                var book = new Book(data[i]);
                core.books.push(book)
            }
            core.display();
        },
        error: function(data) {
            alert('Failed to load.');
        }
    };
    jQuery.ajax(loadall);
}

Core.prototype.search = function() {
    core.loading();
    var query = jQuery('#query').val();
    var search = {
        type: 'GET',
        url: 'http://book.scydev.com/',
        data: { query : query },
        dataType: 'JSON',
        success: function(data) {
            core.books.clear();
            for(var i = 0; i < data.length; ++i) {
                var book = new Book(data[i]);
                core.books.push(book)
            }
            core.display();
        },
        error: function(data) {
            alert('Failed to search.');
        }
    };
    jQuery.ajax(search);
}

Core.prototype.scan = function() {
    var errorFunc = function(err) {
        alert('Failed to scan...');
    };
    cordova.plugins.barcodeScanner.scan(core.showAddMenu, errorFunc);
}

Core.prototype.showAddMenu = function(result) {
    if(result['cancelled']) {
        return;
    }
    
    var menu = jQuery(document.createElement('div'));
    menu.attr({ 'id':'add-book-menu' });
    
    var error = jQuery(document.createElement('div'));
    error.attr({ 'id':'error' });
    
    var price = jQuery(document.createElement('input'));
    price.attr({ 'id':'book-price', 'type':'number', 'placeholder':'Book Price' });
    price.css({ 'width':'70%', 'position':'absolute', 'top':'22%', 'left':'0', 'background-color':'#13ACAA', 'font-size':'25px' });
    
    var post = jQuery(document.createElement('input'));
    post.attr({ 'type':'button', 'value':'Post Book' });
    post.css({ 'width':'30%', 'position':'absolute', 'top':'22%', 'left':'70%', 'background-color':'#275D67' });
    
    menu.append(error, price, post);
    
    var postFunc = function() {
        var p = jQuery('#book-price').val();
        if(jQuery.isNumeric(p)) {
            if(p >= 0) {
                core.lookup(result, p);
                return;
            }
        }
        jQuery('#error').html('Invalid price.');
    };
    
    post.bind('touchstart', postFunc);
    
    jQuery('#search-container').html('');
    jQuery('#search-container').append(menu);
}

Core.prototype.lookup = function(result, price) {
    if(!result || !result.text) {
        jQuery('#search-container').html('');
        return;
    }
    var look = {
        type: 'GET',
        url: 'http://isbndb.com/api/v2/json/9G7BGWHA/book/' + result.text,
        dataType: 'JSON',
        success: function(data) {
            if(!data['error']) {
                core.addbook(data, price);
            } else {
                alert(data['error']);
            }
        },
        error: function(data) {
            alert('Failed to lookup.');
        }
    };
    jQuery.ajax(look);
}

Core.prototype.addbook = function(result, price) {
    var book = result['data'][0];
    var authorTemp = book['author_data'];
    var authors = '';
    for(var i = 0; i < authorTemp.length; ++i) {
        var name = authorTemp[i]['name'];
        var pieces = name.split(', ');
        var fullName = pieces[1] + ' ' + pieces[0];
        if(i == (authorTemp.length - 1)) {
            authors += fullName;
        } else {
            authors += fullName + ', ';
        }
    }
    var isbnTen = book['isbn10'];
    var isbnThir = book['isbn13'];
    var title = book['title_long'];
    if(!title) {
        title = book['title'];
    }
    var request = {
        type: 'GET',
        url: 'http://book.scydev.com/',
        data: { phone_id : device.uuid, title : title, author : authors, isbnTen : isbnTen, isbnThir : isbnThir, price : price},
        dataType: 'JSON',
        success: function(data) {
            if(data['status'] == 'success') {
                alert('Sucessfully added book.');
                core.load();
            } else {
                alert('Failed to add book.');
            }
        },
        error: function(data) {
            alert('Failed to add book.');
        }
    };
    
    jQuery.ajax(request);
    
}

Core.prototype.adduser = function() {
    var user = {
        type: 'GET',
        url: 'http://book.scydev.com/',
        data: { phone_id : device.uuid },
        dataType: 'JSON',
        success: function(data) {
            
        },
        error: function(data) {
            
        }
    };
    jQuery.ajax(user);
}

Array.prototype.clear = function() {
    while (this.length > 0) {
        this.pop();
    }
};