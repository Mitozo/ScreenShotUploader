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
        // $imageFilename = $_FILES['file']['name'];
        $directoryName =  $_FILES['file']['full_path'];
        dd("vrai");
        if (!move_uploaded_file($_FILES['file']['tmp_name'], $directoryName)) {
            return new JsonResponse(['data' => ['error' => "An error occured when uploading the file", 'class' => "danger"]],  400);
        }
        return new JsonResponse(['data' => ['success' => "File successfully uploaded", 'class' => "success"]],  200);
    }

    #[Route('/uploader/removeFile', name : 'remove.imageClipboard')]
    public function removeFile(Request $request): Response
    {
        return new JsonResponse(['data' => ['clipboardFile' => $request]]);
    }
}
