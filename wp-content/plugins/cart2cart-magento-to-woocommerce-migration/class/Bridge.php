<?php

namespace Cart2cart;

class Bridge
{
  const ACTION_INSTALL_BRIDGE = 'install';
  const ACTION_UNINSTALL_BRIDGE = 'uninstall';
  const ACTION_CHECK_BRIDGE = 'checkBridge';

  const MODULE_DEFAULT = 5060;
  const MODULE_BRIDGE_ALREADY_INSTALLED = 5061;
  const MODULE_BRIDGE_SUCCESSFULLY_INSTALLED = 5062;

  const MODULE_ERROR_DEFAULT = 'defaultError';
  const MODULE_ERROR_EMPTY_TOKEN = 5068;
  const MODULE_ERROR_ROOT_DIR_PERMISSION = 5069;
  const MODULE_ERROR_INSTALLED_PERMISSION = 5071;
  const MODULE_ERROR_PERMISSION = 5072;

  protected $_rootPath;
  protected $_bridgePath;
  protected $_bridgeFiles;
  protected $_response;

  public function __construct()
  {
    $this->_rootPath = get_home_path();
    $this->_bridgePath = $this->_rootPath . DIRECTORY_SEPARATOR . 'bridge2cart' . DIRECTORY_SEPARATOR;
    $this->_response = new \stdClass;

    $this->_bridgeFiles = array(
      $this->_bridgePath . 'bridge.php' => 'bridge.php',
      $this->_bridgePath . 'config.php' => 'config.php',
      $this->_bridgePath . 'index.php' => 'index.php',
    );
  }

  public function perform($action, $token)
  {
    try {

      switch ($action) {
        case self::ACTION_INSTALL_BRIDGE:
          $this->_installBridge($token);
        break;
        case self::ACTION_UNINSTALL_BRIDGE:
          $this->_unInstallBridge();
        break;
        default:
          if (!$action) {
            throw new \Exception('Action is required!');
          }

          throw new \Exception('Unknown Action: ' . $action);
      }
    } catch (\Throwable $e) {
      $this->_handleError($e);
    } catch (\Exception $e) {
      $this->_handleError($e);
    }

    if (!isset($this->_response->code)) {
      $this->_response->code = $this->_response->isError ? self::MODULE_ERROR_DEFAULT : self::MODULE_DEFAULT;
    }

    if (!isset($this->_response->message)) {
      $this->_response->message = '';
    }

    return $this->_response;
  }

  /**
   * @param \Exception|\Throwable $exception
   */
  protected function _handleError($exception)
  {
    $this->_response->isError = true;

    if ($exception->getCode() == self::MODULE_ERROR_EMPTY_TOKEN) {
      $this->_response->isError = true;
      $this->_response->code = self::MODULE_ERROR_EMPTY_TOKEN;
      $this->_response->message = 'Token can\'t be blank.';
    } elseif (strpos($exception->getMessage(), 'Permission') !== false) {
      $this->_response->code = self::MODULE_ERROR_PERMISSION;
      $this->_response->message = 'Permission problem.';
    } else {
      $this->_response->message = $exception->getMessage();
    }
  }

  public function isBridgeExist()
  {
    return $this->_checkDirPermission($this->_bridgePath) && $this->_checkBridgeFilesPermission();
  }

  protected function _installBridge($token)
  {
    if ($this->isBridgeExist()) {
      $this->_response->isError = false;
      $this->_response->code = self::MODULE_BRIDGE_SUCCESSFULLY_INSTALLED;
      return;
    }

    $this->_copyBridge($token);
  }

  protected function _copyBridge($token)
  {
    if (!$token) {
      throw new \Exception('Token can\'t be blank.', self::MODULE_ERROR_EMPTY_TOKEN);
    }

    if (!$this->_checkDirPermission($this->_rootPath)) {
      throw new \Exception('Bad permission for Wordpress root folder.', self::MODULE_ERROR_ROOT_DIR_PERMISSION);
    }

    @mkdir($this->_bridgePath, 0755);

    if (!is_dir($this->_bridgePath)) {
      throw new \Exception('Bad permission for bridge folder.', self::MODULE_ERROR_PERMISSION);
    }

    foreach ($this->_bridgeFiles as $file => $fileName) {
      if (!(@copy(CART2CART_PLUGIN_ROOT_DIR . 'bridge2cart/' . $fileName, $file))) {
        throw new \Exception('Bad permission for bridge folder.', self::MODULE_ERROR_PERMISSION);
      }
    }

    if (!$this->_checkDirPermission($this->_bridgePath) || !$this->_checkBridgeFilesPermission()) {
      throw new \Exception(false, self::MODULE_ERROR_INSTALLED_PERMISSION);
    }

    file_put_contents($this->_bridgePath . 'config.php', str_replace('{TOKEN}', $token, file_get_contents($this->_bridgePath . 'config.php')));

    $this->_response->isError = false;
    $this->_response->code = self::MODULE_BRIDGE_SUCCESSFULLY_INSTALLED;
  }

  protected function _unInstallBridge()
  {
    if (!$this->isBridgeExist()) {
      return true;
    }

    return $this->_deleteDir($this->_bridgePath);
  }

  protected function _checkDirPermission($path)
  {
    if (!is_writable($path)) {
      @chmod($path, 0755);
    }

    return is_writable($path);
  }

  protected function _checkBridgeFilesPermission()
  {
    $check = true;

    foreach ($this->_bridgeFiles as $file => $name) {
      $check and $check = $this->_checkBridgeFilePermission($file);
    }

    return $check;
  }

  protected function _checkBridgeFilePermission($pathToFile)
  {
    if (!is_writable($pathToFile)) {
      @chmod($pathToFile, 0755);
    }

    return is_writable($pathToFile);
  }

  protected function _deleteDir($dirPath)
  {
    if (is_dir($dirPath)) {
      $objects = scandir($dirPath);
      foreach ($objects as $object) {
        if ($object != '.' && $object != '..') {
          if (filetype($dirPath . DIRECTORY_SEPARATOR . $object) == 'dir') {
            $this->_deleteDir($dirPath . DIRECTORY_SEPARATOR . $object);
          } else {
            if (!unlink($dirPath . DIRECTORY_SEPARATOR . $object)) {
              return false;
            }
          }
        }
      }
      reset($objects);
      if (!rmdir($dirPath)) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  }
}