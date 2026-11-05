/* equations.js — every displayed equation, with the lecture page it is taken from.
 * `source: null` marks the few lines that define this page's own toy or metrics;
 * they are labelled as such on the page. Pages are PDF page numbers of the files
 * lec03-score-sde.pdf, lec04-flow-based.pdf, lecA-differential-equations.pdf. */
(function (root) {
  'use strict';
  const L3 = 'Score SDE notes';
  const L4 = 'Flow-based notes';
  const LA = 'Differential-equations appendix';
  const eq = {
    'data': { tex: 'p_{\\mathrm{data}}(x)=\\frac1K\\sum_{k=1}^{K}\\mathcal N\\!\\left(x;\\mu_k,\\tau^{2}I\\right),\\qquad K=48,\\quad \\tau=0.06', source: null },
    'forward-sde': { tex: 'dx(t)=f\\big(x(t),t\\big)\\,dt+g(t)\\,dw(t),\\qquad x(0)\\sim p_{\\mathrm{data}},\\qquad (f,g)=\\Big(0,\\sqrt{\\tfrac{d\\sigma^{2}}{dt}}\\Big)', source: [L3, 11, 12] },
    'kernel': { tex: 'p_t(x_t\\mid x_0)=\\mathcal N\\!\\big(x_0,\\,[\\sigma^{2}(t)-\\sigma^{2}(0)]\\,I\\big)\\;=\\;\\mathcal N(x_0,\\,t\\,I)\\quad\\text{for }\\sigma^{2}(t)=t', source: [L3, 18] },
    'marginal': { tex: 'p_t(x_t)=\\int p_t(x_t\\mid x_0)\\,p_{\\mathrm{data}}(x_0)\\,dx_0\\;=\\;\\frac1K\\sum_{k}\\mathcal N\\!\\big(x_t;\\mu_k,(\\tau^{2}+t)\\,I\\big)', source: [L3, 21] },
    'fokker-planck': { tex: '\\partial_t p_t=-\\nabla\\!\\cdot\\!\\big(f\\,p_t\\big)+\\tfrac12 g^{2}\\Delta p_t\\qquad\\xrightarrow{\\;f=0\\;}\\qquad \\partial_t p_t=\\tfrac12 g^{2}\\Delta p_t', source: [L3, 34, 51] },
    'landscape': { tex: 'U_t(x):=-\\log p_t(x),\\qquad \\nabla\\log p_t(x)=-\\nabla U_t(x)', source: null },
    'reverse-sde': { tex: 'd\\bar x(t)=\\big[f(\\bar x(t),t)-g(t)^{2}\\,\\nabla\\log p_t(\\bar x(t))\\big]\\,dt+g(t)\\,d\\bar w(t),\\qquad \\bar x(T)\\sim p_T', source: [L3, 63] },
    'pf-ode': { tex: '\\frac{d\\tilde x(t)}{dt}=f(\\tilde x(t),t)-\\tfrac12\\,g(t)^{2}\\,\\nabla\\log p_t(\\tilde x(t))', source: [L3, 73] },
    'eta-family': { tex: 'd\\bar x(t)=\\Big[f-\\tfrac{1+\\eta^{2}}{2}\\,g^{2}\\,\\nabla\\log p_t\\Big]dt+\\eta\\,g\\,d\\bar w(t),\\qquad \\eta\\ge 0', source: [L3, 78] },
    'toy-step': { tex: 'x\\;\\leftarrow\\;x+\\tfrac{1+\\eta^{2}}{2}\\,\\tilde s(x,t)\\,h+\\eta\\sqrt h\\,z,\\qquad z\\sim\\mathcal N(0,I),\\quad t\\;\\leftarrow\\;t-h', source: null },
    'noncross': { tex: 'x_1(0)\\neq x_2(0)\\;\\Longrightarrow\\;x_1(t)\\neq x_2(t)\\quad\\text{for all }t\\in[0,T]', source: [LA, 10] },
    'flow-map': { tex: '\\Psi_{t\\to s}\\circ\\Psi_{s\\to t}=\\mathrm{id},\\qquad \\Psi_{s\\to t}\\circ\\Psi_{t\\to s}=\\mathrm{id}', source: [L4, 7] },
    'substitutions': { tex: '\\nabla\\log p_t\\;\\to\\;s_{\\phi^{\\times}},\\qquad p_T\\;\\to\\;p_{\\mathrm{prior}},\\qquad [0,T]\\;\\to\\;\\{t_n\\}_{n=0}^{N}', source: [L3, 86] },
    'snr': { tex: '\\mathrm{SNR}(T):=\\frac{E(0\\to T)^{2}}{P(T)}\\;=\\;\\frac{1}{g^{2}T}\\quad\\text{here, since }E\\equiv1,\\;P(T)=g^{2}T', source: [L3, 23] },
    'kl-bound': { tex: 'D_{\\mathrm{KL}}\\big(p_T\\,\\|\\,\\mathcal N(0,P(T)\\,I)\\big)\\;\\le\\;\\tfrac12\\,\\mathrm{SNR}(T)\\;\\mathbb E\\|x_0\\|^{2}', source: [L3, 26] },
    'dsm': { tex: '\\mathcal L_{\\mathrm{DSM}}(\\phi)=\\tfrac12\\,\\mathbb E_t\\,\\mathbb E_{x_0}\\,\\mathbb E_{x_t\\mid x_0}\\;\\omega(t)\\,\\big\\|s_\\phi(x_t,t)-\\nabla\\log p_t(x_t\\mid x_0)\\big\\|^{2}', source: [L3, 83] },
    'dsm-min': { tex: 's^{\\star}_\\phi(x,t)=\\mathbb E\\big[\\nabla\\log p_t(x_t\\mid x_0)\\,\\big|\\,x_t=x\\big]=\\nabla\\log p_t(x)', source: [L3, 84] },
    'perturbed': { tex: '\\tilde s(x,t):=\\nabla\\log p_{t+\\delta}(x)+b,\\qquad \\delta\\ge0\\;(\\text{blur}),\\quad b\\in\\mathbb R^{2}\\;(\\text{tilt})', source: null },
    'em': { tex: 'x_{t-\\Delta t}\\;\\leftarrow\\;x_t-\\big[f(x_t,t)-g^{2}(t)\\,s_{\\phi^{\\times}}(x_t,t)\\big]\\Delta t+g(t)\\sqrt{\\Delta t}\\,z', source: [L3, 87] },
    'euler-ode': { tex: 'x_{t-\\Delta t}\\;\\leftarrow\\;x_t-\\big[f(x_t,t)-\\tfrac12 g^{2}(t)\\,s_{\\phi^{\\times}}(x_t,t)\\big]\\Delta t', source: [L3, 87] },
    'heun': { tex: 'x_{\\mathrm{pred}}=x_n+h\\,v(x_n,t_n),\\qquad x_{n+1}=x_n+\\tfrac h2\\big[v(x_n,t_n)+v(x_{\\mathrm{pred}},t_n+h)\\big]', source: [LA, 16] },
    've-step': { tex: 'x_{i-1}\\;\\leftarrow\\;x_i+\\big(\\sigma_i^{2}-\\sigma_{i-1}^{2}\\big)\\,s_{\\phi^{\\times}}(x_i,\\sigma_i)+\\sqrt{\\sigma_i^{2}-\\sigma_{i-1}^{2}}\\;z', source: [L3, 89] },
    'metrics': { tex: '\\mathrm{TV}:=\\tfrac12\\sum_{k=1}^{K}\\big|\\hat f_k-m_k\\big|,\\qquad \\mathrm{spread}:=\\Big(\\tfrac1N\\sum_{n}\\|x_n-\\mu_{k(n)}\\|^{2}\\Big)^{1/2}', source: null },
    'fm-velocity': { tex: 'v_t(x)=\\frac{\\dot b_t}{b_t}\\,x+a_t^{2}\\Big(\\frac{\\dot b_t}{b_t}-\\frac{\\dot a_t}{a_t}\\Big)\\nabla\\log p_t(x)', source: [L4, 64] },
    'fm-identification': { tex: '\\tilde x_t\\;=\\;\\tilde y_{\\,T-t}\\quad\\text{in distribution, for }t\\in(0,T),\\qquad \\alpha_s=b_{T-s},\\;\\sigma_s=a_{T-s}', source: [L4, 66, 69, 74] },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = eq;
  else root.BoardEquations = eq;
})(globalThis);
