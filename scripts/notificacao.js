function showNotifaication() {
                if (!("Notification" in window)) {
                    alert("Desktop notifications is not supported by this browser. Try another.");
                    return;
                } else if (Notification.permission === "granted") {
                    var myNotification = new Notification("How to parse nested JSON object in Java", {
                        icon: "https://www.websparrow.org/images/java-logo.png",
                        body: "In this Java tutorial we are going to parse/read the nested JSON object using JSON.simple library."
                    });
                    myNotification.onclick = function () {
                        window.open("https://www.websparrow.org/java/how-to-parse-nested-json-object-in-java");
                    };

                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission(function (userPermission) {
                        if (userPermission === "granted") {
                            var myNotification = new Notification("Spring Tutorials", {
                                icon: "https://www.websparrow.org/images/spring-logo.png",
                                body: "Welcome to Spring Framework tutorials on websparrow.org. Before starting all the other things, first we need to configure/install framework."
                            });
                            myNotification.onclick = function () {
                                window.open("https://www.websparrow.org/spring/");
                            };
                            // setTimeout(myNotification.close.bind(myNotification), 5000);
                        }
                    });
                }
            }