

Router.route('/', function () {
    this.render('body', {
      data: function () { return CardSets.find(); }
    });
  });
