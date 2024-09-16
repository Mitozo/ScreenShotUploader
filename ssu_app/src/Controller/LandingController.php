<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class LandingController extends AbstractController
{
    #[Route('/', name: 'app.landing')]
    public function index(): Response
    {
        $list_of_uploaded_image = $this->generateUrl('uploader.image.list');
        $upload_form = $this->generateUrl('uploader');
        return $this->render('landing/index.html.twig', [
            'controller_name' => 'Landing page',
            'h1' => 'Welcome do Screenshot uploader',
            'cta' => $upload_form,
            'list_of_uploaded_image' => $list_of_uploaded_image,
            'content' => "
                    The pusrpose of this app is to upload image file in the clipboard.
                    Once you've got an element in your clipboard for instance by printing the screen using SHIFT+WIN+S, you can immediately paste the object
                    in the specified field on the form. Then, on paste event it send the file through XmlHttpRequest to the server and upload it to the dedicated directory for image file.
                    You can thereafter, browse images that you've already uploaded with the link below. 
               "
        ]);
    }
}
