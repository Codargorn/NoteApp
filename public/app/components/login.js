// language=HTML
import {createElementFromHTML} from "../html.js";

const template = `
    <div class="login">
        <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="email">
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" autocomplete="off">
        </div>
        <button class="btn btn-primary signin">Submit</button>
    </div>
`;


/**
 * @param {HTMLElement} $app
 * @param {Jobs} jobs
 */
function mount($app, jobs) {
    const $login = createElementFromHTML(template);
    const $signinButton = $login.querySelector('.signin');

    $login.querySelector(`#password`).addEventListener('keyup', e => {
        if (e.code === 'Enter') {
            $signinButton.click();
        }
    })


    $signinButton.addEventListener('click', _ => {
        const form = new FormData();
        form.append('email', $login.querySelector('#email').value);
        form.append('password', $login.querySelector('#password').value)

        fetch('/api/login.php', {method: 'POST', body: form})
            .then(response => response.json())
            .then(body => {
                if (body.success) {
                    $login.style.display = 'none';
                    $app.querySelector('.content').style.display = 'block';

                    document.dispatchEvent(new CustomEvent('fetch-notes'));

                    jobs.run();
                }
            });
    })

    $app.appendChild($login);

    fetch('/api/login.php')
        .then(response => response.json())
        .then(body => {
            if (body.success) {
                $login.style.display = 'none';
                $app.querySelector('.content').style.display = 'block';

                document.dispatchEvent(new CustomEvent('fetch-notes'));
            }
        });
}

const LoginComponent = {
    mount
}

export default LoginComponent

