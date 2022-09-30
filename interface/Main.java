import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;

public class Main {
  private static JTextField userField;
  private static JTextField passField;
  private static JFileChooser fileChooser;
  public static void main(String[] args) {
    JFrame frame = new JFrame();
    JPanel panel = new JPanel();

    frame.add(panel);
    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    frame.setSize(500, 600);
    frame.setLocationRelativeTo(null);
    frame.setTitle("Configurações iniciais do Bot");

    JPanel user = new JPanel();
    JLabel userLabel = new JLabel("Usuário bling");
    JTextField username = new JTextField(30);
    JPanel pass = new JPanel();
    JLabel passLabel = new JLabel("Senha");
    JTextField password = new JTextField(30);
    JFileChooser filechooser = new JFileChooser();
    JButton startBtn = new JButton("Rodar bot");
    JButton logBtn = new JButton("Abrir log");

    user.add(userLabel);
    user.add(username);
    panel.add(user);
    pass.add(passLabel);
    pass.add(password);
    panel.add(pass);
    panel.add(filechooser);
    panel.add(startBtn);
    panel.add(logBtn);

    Main.userField = username;
    Main.passField = password;
    Main.fileChooser = filechooser;

    startBtn.addActionListener(new ActionListener() {
      @Override
      public void actionPerformed(ActionEvent e) {
        String username = Main.userField.getText();
        String password = Main.passField.getText();
        String filename = Main.fileChooser.getSelectedFile().getAbsolutePath();
        String rootDir = System.getProperty("user.dir");

        try {
          logBtn.setEnabled(false);
          Process proc = new ProcessBuilder(
            "\"C:\\Program Files\\nodejs\\node.exe\" \""+rootDir+"\\index.js\"", 
            username,
            password,
            filename
          ).start();

          proc.waitFor();
          ByteArrayOutputStream inputResult = new ByteArrayOutputStream();
          ByteArrayOutputStream errorResult = new ByteArrayOutputStream();
          byte[] buffer = new byte[65536];
          for (int length; (length = proc.getInputStream().read(buffer)) != -1; ) {
            inputResult.write(buffer, 0, length);
          }
          PrintWriter log = new PrintWriter("log.txt", "UTF-8");
          System.out.println(inputResult.toString("UTF-8"));
          log.println(inputResult.toString("UTF-8"));
          for (int length; (length = proc.getErrorStream().read(buffer)) != -1; ) {
            errorResult.write(buffer, 0, length);
          }
          System.out.println(errorResult.toString("UTF-8"));
          log.println(errorResult.toString("UTF-8"));
          log.close();
          buffer = new byte[65536];
        } catch (IOException e1) {
          e1.printStackTrace();
        } catch (InterruptedException e1) {
          e1.printStackTrace();
        }
        logBtn.setEnabled(true);
      }
    });

    logBtn.addActionListener(new ActionListener() {
      @Override
      public void actionPerformed(ActionEvent e) {
        String rootDir = System.getProperty("user.dir");
        try {
          Process proc = new ProcessBuilder(rootDir+"\\open_log.bat").start();
        } catch (IOException e1) {
          e1.printStackTrace();
        }
      }
    });
    
    frame.setVisible(true);
  }
}