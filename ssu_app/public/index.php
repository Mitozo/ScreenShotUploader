<?php


// echo "Landing page";
use App\Kernel;

// var_dump(dirname(__DIR__).'/vendor/autoload_runtime.php');die;
require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
