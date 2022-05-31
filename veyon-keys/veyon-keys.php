<?php
#echo($output);
$NAME='abc';
if ($_GET['key'] == "pub")
{
    shell_exec("sudo /usr/bin/veyon-cli authkeys create $NAME");
    sleep(1);
    $output = shell_exec("sudo cat /etc/veyon/keys/public/$NAME/key");
    echo("$output");
}
elseif ($_GET['key'] == "priv")
{
    $output = shell_exec("sudo cat /etc/veyon/keys/private/$NAME/key");
    echo("$output");
}
elseif ($_GET['key'] == "done")
{
    $output = shell_exec("sudo rm /etc/veyon/keys{/private/$NAME/key,public/$NAME/key && echo OK || echo FAILED");
    echo("$output");
}

?>