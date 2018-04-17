'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// COMMENT (COMPLETED): Why isn't this method written as an arrow function?
// This method is not written as an arrow function because the function won't execute properly if the scope of this is changed to the next level up, outside the function.
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENT (COMPLETED): What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // THe question mark serves as a boolean of sorts. It asks if this condition is 'true', then run this, if false, run this. The colon serves to separate what will run if the condition is true or false.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENT (COMPLETED): Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// This function is called in the below, Article.fetchAll function. If the local storage contains the rawData, we run the Article.loadAll function. The rawData is an array of objects loaded from local storage.


// REVIEW: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEW: What is this 'if' statement checking for? Where was the rawData set to local storage?
  if (localStorage.rawData) {

    Article.loadAll(JSON.parse(localStorage.rawData));
    articleView.initIndexPage();

  } else {
    let url = '/data/hackerIpsum.json';
    $.getJSON(url)
      .then(data => {
        Article.loadAll(data);
        localStorage.rawData = JSON.stringify(data);
        articleView.initIndexPage();
      })
      .catch(err => console.error('poop', err));

    console.log('fetched yo');

  }
}

Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// let renderResults = ((data) => {
//   let templateNew = $('#articles').html();
//   let searchTemplate = Handlebars.compile(templateNew);

//   $('#articles ul').empty();

//   data.forEach( (listing) => {
//     $('#articles ul').append(searchTemplate(listing));
//   });

//   $('#articles ul').fadeIn(125);
// };