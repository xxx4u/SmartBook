
function Core() {
    this.books = new Array();
}

Core.prototype.display = function() {
    jQuery('#search-container').html('');
    for(var i = 0; i < this.books.length; ++i) {
        this.books[i].build();
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
    cordova.plugins.barcodeScanner.scan(core.lookup, errorFunc);
}

Core.prototype.lookup = function(result) {
    var look = {
        type: 'GET',
        url: 'http://isbndb.com/api/v2/json/9G7BGWHA/book/' + result.text,
        dataType: 'JSON',
        success: function(data) {
            core.addbook(data);
        },
        error: function(data) {
            alert('Failed to lookup.');
        }
    };
    jQuery.ajax(look);
}

Core.prototype.addbook = function(result) {
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
        data: { phone_id : device.uuid, title : title, author : authors, isbnTen : isbnTen, isbnThir : isbnThir},
        dataType: 'JSON',
        success: function(data) {
            if(data['status'] == 'success') {
                alert('Sucessfully added book.');
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