<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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

    #[Route('/uploader/doUpload', name : 'upload.imageClipboard')]
    public function doUpload(Request $request): Response
    {
        dd($request);
        return new JsonResponse(['clipboardFile' => $request, 'upload_file' => true]);
    }

    #[Route('/uploader/removeFile', name : 'remove.imageClipboard')]
    public function removeFile(Request $request): Response
    {
        return new JsonResponse(['clipboardFile' => $request]);
    }
}
