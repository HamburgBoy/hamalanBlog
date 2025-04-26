document.addEventListener('visibilitychange', function () {
    if (document.visibilityState == 'hidden') {
        normal_title = "Ciallo～(ゝ∀･)";
        document.title = '∑(ι´Дン)ノ还会再来吗？';
    } else document.title = normal_title;
});