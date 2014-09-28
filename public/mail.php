<?php
require '../php_libs/PHPMailer/PHPMailerAutoload.php';

if($_SERVER['REQUEST_METHOD'] === "POST") {
    $htmlCode = $_POST["html-code"];
    $cssCode = $_POST["css-code"];
    $email = $_POST["email"];

    $arErrors = validate($htmlCode, $cssCode, $email);
    if(count($arErrors) > 0) {
        sendData(array("ERRORS" => $arErrors));
    }

    $mail = new PHPMailer;
    $mail->isSMTP();
    $mail->Host = 'smtp.bk.ru';
    $mail->SMTPAuth = true;
    $mail->Username = 'test.ts';
    $mail->Password = 'testtesttest';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;

    $mail->From = 'test.ts@bk.ru';
    $mail->FromName = 'ButtonGenerator';
    $mail->addAddress($email);

    $mail->CharSet = "UTF-8";
    $mail->isHTML(false);
    $mail->Subject = 'Сгенерированная кнопка';
    $mail->Body    = "HTML code: \n {$htmlCode} \n CSS code: \n {$cssCode}";

    if(!$mail->send()) {
        $error = "Ошибак при отправке письма: {$mail->ErrorInfo}";
        sendData(array("ERRORS" => array($error)));
    } else {
        sendData(array("SUCCESS" => "Данные успешно доставлены"));
    }

}

function validate($html, $css, $email) {
    $arErrors = array();
    foreach(array("html" => $html, "css" => $css, "email" => $email) as $name => $data) {
        if(empty($data)) {
            $arErrors[] = "Поле {$name} не должно быть пустым.";
        }
    }

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $arErrors[] = "Поле email не валидно.";
    }

    return $arErrors;
}

function sendData($data) {
    echo json_encode($data);
    die();
}