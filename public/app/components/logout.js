/**
 *
 * @param  {HTMLElement} $app
 * @param  {Jobs} jobs
 */
function mount($app, jobs) {
    const $logout = $app.querySelector('.signout');

    $logout.addEventListener('click', _ => {
        fetch('/api/logout.php', {method: 'GET'})
            .then(response => response.json())
            .then(body => {
                if (body.success) {
                    const $login = $app.querySelector('.login');
                    $login.querySelector('#email').value = '';
                    $login.querySelector('#password').value = '';
                    $login.style.display = 'block';

                    $app.querySelector('.content').style.display = 'none';

                    jobs.stopAll();
                }
            });
    })
}

const LogoutComponent = {
    mount
}
export default LogoutComponent