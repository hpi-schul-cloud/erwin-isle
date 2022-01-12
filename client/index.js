function fetchUserData() {
    fetch('/educational-identity')
        .then(response => {
            if (!response.ok) {
                throw Error("Error");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const userHtml = data
                .map(educational_identity => {
                    return `<li class="list-group-item">Id: ${educational_identity.id}<br>
                                First Name: ${educational_identity.firstName}<br>
                                Last Name: ${educational_identity.lastName}<br>
                                Preferred Name: ${educational_identity.preferredName}<br>
                                Date of Birth: ${educational_identity.dateOfBirth}<br>
                                Student Id: ${educational_identity.studentId}

                                <div class="btn-group dropend" style="float: right">
                                    <button class="btn btn-outline-dark btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        Add school
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" id="schoolsContainer">
                                        <li><a class="dropdown-item" href="#">School A</a></li>
                                        <li><a class="dropdown-item" href="#">School B</a></li>
                                        <li><a class="dropdown-item" href="#">School C</a></li>
                                    </ul>
                                </div>

                            </li>`;
                })
                .join("");
            document.querySelector("#userContainer").insertAdjacentHTML("afterbegin", userHtml);
        })
        .catch(error => {
            console.log(error);
        });
}

fetchUserData();


function fetchSchoolData() {
    fetch('/educational-school')
        .then(response => {
            if (!response.ok) {
                throw Error("Error");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const schoolHtml = data
                .map(educational_school => {
                    return `<li class="list-group-item">Id: ${educational_school.id}<br>
                                Name: ${educational_school.displayName}<br>
                                School Id: ${educational_school.schoolId}
                            </li>`;
                })
                .join("");
            document.querySelector("#schoolContainer").insertAdjacentHTML("afterbegin", schoolHtml);
        })
        .catch(error => {
            console.log(error);
        });
}

fetchSchoolData();


