<?php
namespace Deployer;

require 'recipe/laravel.php';
require 'contrib/npm.php';

// Config

set('repository', 'git@gitlab.n2rtechnologies.com:nurulhasan/broom-service.git');

add('shared_files', []);
add('shared_dirs', []);
add('writable_dirs', []);

// Hosts
host('production')
    ->set('hostname','104.248.17.6' )
    ->set('branch', 'main')
    ->set('remote_user', 'root')
    ->set('deploy_path', '/var/www/html')
    ->set('keep_releases', 1);

host('development')
    ->set('hostname','38.242.196.238' )
    ->set('branch', 'development')
    ->set('remote_user', 'root')
    ->set('deploy_path', '/var/www/php81/broom-service-new')
    ->set('keep_releases', 2);

// Hooks
task('deploy', [
    'deploy:prepare',
    'deploy:vendors',
    'artisan:storage:link',
    'artisan:view:cache',
    'artisan:config:cache',
    'artisan:migrate',
    'npm:install',
    'npm:run:prod',
    'deploy:publish',
]);

task('npm:run:prod', function () {
    cd('{{release_or_current_path}}');
    run('composer install');
    run('npm run prod');
});

after('deploy:failed', 'deploy:unlock');