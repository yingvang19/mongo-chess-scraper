
$(document).ready(function() {
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);

  function initPage() {
    $.get("/api/headlines?saved=false").then(function(data) {
      articleContainer.empty();
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    var articleCards = [];
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    articleContainer.append(articleCards);
  }

  function createCard(article) {
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank'>")
          .attr("href", article.url) 
          
          .text(article.headline),
        $("<a class='btn btn-success save'>Save Article</a>")
      )
    );
    console.log(article.url);
    var cardBody = $("<div class='card-body'>").text(article.summary);
    card.append(cardHeader, cardBody);
    card.data("_id", article._id);
    return card;
  }

  function renderEmpty() {
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
    var articleToSave = 
      $(this)
      .parents(".card")
      .data();

      $(this)
      .parents(".card")
      .remove();

    articleToSave.saved = true;
    console.log(articleToSave)
    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function(data) {
      console.log(data)
      if (data) {
        location.reload();
      }
    });
  }

  function handleArticleScrape() {
    $.get("/api/fetch").then(function(data) {
      console.log(data)
      window.location.href = "/";
    });
  }

  function handleArticleClear() {
    $.get("api/clear").then(function(data) {
      console.log(data)
      articleContainer.empty();
      location.reload();
    });
  }

});

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}