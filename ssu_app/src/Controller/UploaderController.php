<?php

namespace App\Controller;

use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class UploaderController extends AbstractController
{
    #[Route('/uploader', name: 'uploader')]
    public function index(): Response
    {
        return $this->render('uploader/index.html.twig', [
            'controller_name' => 'UploaderController',
        ]);
    }

    #[Route('/uploader/doUpload', name: 'upload.imageClipboard')]
    public function doUpload(Request $request, CsrfTokenManagerInterface $csrfTokenManager): Response
    {
        $token = 'upload_image';
        if (!$this->isCsrfTokenValid($token, $request->request->get('_csrf_token'))) {
            return new JsonResponse([
                'data' => ['error' => 'Invalid CSRF token',
                'class' => 'danger'
                ]
            ], 200);
        }
        $directoryName =  $this->getParameter('file_upload_directory') . $_FILES['file']['name'];
        
        try {
            if (!move_uploaded_file($_FILES['file']['tmp_name'], $directoryName)) {
                return new JsonResponse(['data' => ['error' => "An error occured when uploading the file", 'class' => "danger"]],  400);
            }
            return new JsonResponse(['data' => ['success' => "File successfully uploaded", 'class' => "success"]],  200);
        } catch (Exception $ex) {
            return new JsonResponse(['data' => ['Exception' => $ex->getMessage(), 'class' => "success"]],  401);
        }
    }

    #[Route('/uploader/removeFile', name: 'remove.imageClipboard')]
    public function removeFile(Request $request): Response
    {
        return new JsonResponse(['data' => ['clipboardFile' => $request]]);
    }
}
