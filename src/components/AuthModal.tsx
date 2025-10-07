import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let result;
      
      if (mode === 'signup') {
        if (!username.trim()) {
          setError('ユーザー名を入力してください');
          return;
        }
        result = await signUp(email, password, username);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        setError(getErrorMessage(result.error));
      } else {
        // 成功時はモーダルを閉じる
        onClose();
        resetForm();
      }
    } catch (error) {
      setError('予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error: any): string => {
    if (error.message?.includes('Invalid login credentials')) {
      return 'メールアドレスまたはパスワードが正しくありません';
    }
    if (error.message?.includes('User already registered')) {
      return 'このメールアドレスは既に登録されています';
    }
    if (error.message?.includes('Password should be at least 6 characters')) {
      return 'パスワードは6文字以上で入力してください';
    }
    if (error.message?.includes('Unable to validate email address')) {
      return '有効なメールアドレスを入力してください';
    }
    return error.message || '認証エラーが発生しました';
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError(null);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>{mode === 'signin' ? 'ログイン' : 'アカウント作成'}</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="username">ユーザー名</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ユーザー名を入力"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {mode === 'signup' && (
              <small className="form-hint">6文字以上で入力してください</small>
            )}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '処理中...' : (mode === 'signin' ? 'ログイン' : 'アカウント作成')}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {mode === 'signin' ? 'アカウントをお持ちでない方は' : '既にアカウントをお持ちの方は'}
            <button type="button" onClick={switchMode} className="switch-btn">
              {mode === 'signin' ? 'アカウント作成' : 'ログイン'}
            </button>
          </p>
        </div>

        <div className="auth-info">
          <p className="info-text">
            ゲストとしてもプレイできますが、ログインすると進行状況が保存され、
            ランキングに参加できます。
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
