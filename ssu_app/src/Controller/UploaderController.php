<?php

namespace App\Controller;

use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UploaderController extends AbstractController
{
    #[Route('/uploader', name: 'uploader')]
    public function index(): Response
    {
        $list_of_uploaded_image = $this->generateUrl('uploader.image.list');
        $landing_page = $this->generateUrl('app.landing');
        return $this->render('uploader/index.html.twig', [
            'controller_name' => 'UploaderController',
            'list_of_uploaded_image' => $list_of_uploaded_image,
            'landing_page' => $landing_page,
        ]);
    }

    #[Route('/uploader/list', name: 'uploader.image.list')]
    public function imageList(): Response
    {
        $uploadPath = $this->getParameter('file_upload_directory');
        $pathToUploadForm = $this->generateUrl('uploader');
        $finder = new Finder();
        $finder->files()->in($uploadPath);
        $filesInDir = [];
        foreach ($finder as $file) {
            $fileNameWithExtension = $file->getRelativePathname();
            $filesInDir[] = $fileNameWithExtension;
        }
        $uploadPath = 'uploader';
        return $this->render('uploader/list_uploaded_img.html.twig', compact('filesInDir', 'pathToUploadForm'));
    }


    #[Route('/uploader/doUpload', name: 'uploader.imageClipboard')]
    public function doUpload(Request $request): Response
    {
        $token = 'upload_image';
        if (!$this->isCsrfTokenValid($token, $request->request->get('_csrf_token'))) {
            return new JsonResponse([
                'data' => ['error' => 'Invalid CSRF token',
                'class' => 'danger'
                ]
            ], 200);
        }

        $fileSystem = new Filesystem();
        if (!$fileSystem->exists($this->getParameter(('file_upload_directory')))) {
            $fileSystem->mkdir($this->getParameter('file_upload_directory'), 0755);
        }
        $directoryName =  $this->getParameter('file_upload_directory') . $_FILES['file']['name'];
        
        try {
            if (!move_uploaded_file($_FILES['file']['tmp_name'], $directoryName)) {
                return new JsonResponse(['data' => ['msg' => "An error occured when uploading the file", 'class' => "text-danger"]],  400);
            }
            return new JsonResponse(['data' => ['msg' => "File successfully uploaded", 'class' => "text-success"]],  200);
        } catch (Exception $ex) {
            return new JsonResponse(['data' => ['msg' => $ex->getMessage(), 'class' => "text-warning"]],  401);
        }
    }

    #[Route('/uploader/removeFile', name: 'remove.imageClipboard')]
    public function removeFile(Request $request): Response
    {
        $directoryName =  $this->getParameter('file_upload_directory') . $request->request->get('filename') . '.png';
        if (unlink($directoryName)) {
            return new JsonResponse(['data' => ['msg' => "File successfully removed", "class" => "text-warning"]], 200);
        } else {
            return new JsonResponse(['data' => ['msg' => "An error occured when removing the image file, maybe the file doesn't exist", "class" => "text-dangerg"]], 500);
        }
    }
}
