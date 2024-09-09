<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UploaderController extends AbstractController
{
    #[Route('/uploader', name: 'uploader')]
    public function index(): Response
    {
        return $this->render('uploader/index.html.twig', [
            'controller_name' => 'UploaderController',
        ]);
    }
}
