// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      //user/translate
      welcome: 'Welcome to the App',
      switchLanguage: 'Switch Language',
      selectLanguage: 'Please select your language',
      languageChanged: 'Language changed to {{lang}}',

      //user/dashboardLayout
      uploadImage: 'Upload Image',
      dashboard: 'Dashboard',
      comment: 'Comments',
      translate: 'Translate',
      logout: 'Log out',
      subscription: 'Subscription',
      logoutConfirm: 'Are you sure you want to log out?',
      yes: 'Yes',
      cancel: 'Cancel',
      faqHelp: 'FAQ / Help',
      reportBug: 'Report Bug',
      resultHistory: 'Result History',

      //user/upload
      uploadMaizeImages: 'Upload Maize Images',
      dragAndDrop: "Drag and drop your image{{isPremium}} or",
      browse: 'Browse',
      supportedFormats: "Support {{formats}}",
      imageCount: 'Image count',
      reset: 'Reset',
      count: 'Count',
      counting: 'Counting...',
      checkDisease: 'Check Disease (Premium)',
      checking: 'Checking...',
      premiumFeatureAlert: 'Only premium users can upload ZIP/multiple images and use disease detection.',
      notMaizeConfirm: 'This seems like not a maize, are you sure you want to continue?',
      continueDetection: 'Continue Detection',
      singleLeafTip: 'for best use please use single leaf',
      continueDetectionAcknowledge: 'I acknowledge, continue detection',
      results: 'Results',
      result: 'Result',
      remove: 'Remove',
      uploadImageFirstAlert: 'Please upload an image first',
      freeUserMultiUploadAlert: 'Free users can only upload one image.',
      zipUploadPremiumAlert: 'Only premium users can upload ZIP files.',
      detectionFailed: 'Detection failed',
      countFailed: 'Count failed',
      diseaseDetectionFailed: 'Disease detection failed',
      analysisResult: "Analysis Result",
      disease: "Disease",
      diseaseNames: { 
        Blight: "Blight", 
        Common_Rust: "Common Rust", 
        Gray_Leaf_Spot: "Gray Leaf Spot", 
        Healthy: "Healthy" 
      },
      viewImage: "View Image",
      suggestions: "Suggestions",
      actions: "Actions",
      remainingImages: 'Remaining',
      images: 'images',



      //user/bug
      reportBugTitle: 'Report BUG',
      reportABug: 'Report a Bug',
      bugTitleLabel: 'Bug Title',
      descriptionLabel: 'Description',
      titleDescriptionEmpty: 'Title and description cannot be empty.',
      submissionFailed: 'Failed to submit bug report. Please try again.',
      submitBugReport: 'Submit Bug Report',
      bugReportSubmitted: 'Bug report submitted successfully',

      //user/FAQ
      faqHelpTitle: 'FAQ / Help',
      faqHelpDocument: 'FAQ / Help Document',
      searchPlaceholder: 'Search help topics...',
      loadingFAQs: 'Loading FAQs...',
      failedToLoadFAQs: 'Failed to load FAQs. Please check if the backend server is running or try again later.',
      retry: 'Retry',
      noFaqsFound: 'No FAQs found matching your search.',
      noFaqsInDatabase: 'No FAQs available in the database.',
      stillNeedHelp: 'Still need help? Contact support',

      //user/subscription
      subscriptionPlan: 'Subscription Plan',
      chooseYourPlan: 'Choose Your Plan',
      freePlan: 'FREE',
      freePrice: '$0',
      basicCount: 'Basic Count',
      zipUpload: 'ZIP Upload',
      multiImageUpload: 'Multiple images Upload',
      currentPlan: 'Current Plan',
      premiumPlan: 'PREMIUM',
      premiumPrice: '$20',
      daysRemaining: '{{daysRemaining}} days remaining',
      expires: 'Expires',
      allFeatures: 'All features',
      diseaseDetection: 'Disease detection',
      upgrade: 'Upgrade',
      securePaymentNote: 'Secure payment. Cancel at the end of the month.',
      paymentSuccessfulAlert: 'Payment successful! Your premium membership is now active.',
      completeYourPurchase: 'Complete Your Purchase',
      fullNameLabel: 'Full Name',
      enterYourNameAlert: 'Please enter your name',
      fullNamePlaceholder: 'Enter your full name',
      cardDetailsLabel: 'Card Details',
      processingPayment: 'Processing...',
      payNow: 'Pay Now',
      paymentFailedAlert: 'Payment failed. Please try again.',
      perMonth: 'month',

      //user/comment
      viewCommentsTitle: 'View Comments',
      userComments: 'User Comments',
      loadingComments: 'Loading comments...',
      failedToLoadComments: 'Failed to load comments. Please try again later.',
      noCommentsAvailable: 'No comments available.',
      anonymous: 'Anonymous',
      unknownTime: 'Unknown time',
      agentReply: 'Agent Reply',
      loading: 'Loading...',
      loadMore: 'Load More',
      addComment: 'Add Comment',

      //user/result
      viewResultTitle: 'Result History',
      myResults: 'My Results',
      view: 'View',
      delete: 'Delete',
      AddNote: 'Add Note',
      AddDescription: 'Add your description for this result',
      EnterNote: 'Enter your notes here...',
      imageSavedSuccess: 'Image saved successfully!',
      saveImageError: 'Error saving image: {{error}}',

      //user/viewResult
      detectionResultTitle: 'Detection Result',
      detectionResult: 'Detection Result',
      totalMaizeCount: 'Total Maize Count',
      processingTime: 'Processing Time',
      imageSize: 'Image Size',
      back: 'Back',
      Date: 'Date',
      type: 'Detect Type',
      searchResults: 'Search Results',
      number: 'Number',
      note: 'Note',
      date: 'Date',
      imageId: 'Image ID',
      id: 'Num',
      maizeCount: 'Maize Count',
     

      //user/dashboard
      weatherInSingapore: 'Weather in Singapore',
      loadingWeather: 'Loading weather...',
      failedToLoadWeather: 'Failed to load weather data. Please try again.',
      today: 'Today',
      wind: 'Wind',
      kmPerHour: 'km/h',
      humidity: 'Humidity',
      loadingForecast: 'Loading forecast...',
      lastUpdated: 'Last updated',
      hint: 'Hint: Check the following 7 days weather!!',

      //user/updateAcc
      updateAccountTitle: 'Update Account',
      updateAccount: 'Update Account',
      loadingAccountData: 'Loading account data...',
      missingAccountOrProfileID: 'Missing account or profile ID. Please log in again.',
      fetchDataError: 'Failed to fetch data: {{message}}. Check network or authentication.',
      fetchDataFailedMessage: 'An error occurred while fetching data!',
      accountIdNotAvailable: 'Account ID not available, please login again!',
      enterCurrentPassword: 'Please enter your current password to change it.',
      newPasswordRequirements: 'New password does not meet all requirements!',
      passwordChangeFailed: 'Failed to change password: {{detail}}',
      somethingWentWrong: 'Something went wrong.',
      passwordChangeSuccess: 'Password changed successfully!',
      passwordChangeError: 'An error occurred during password change. Please try again.',
      updateSuccess: 'Account and profile details updated successfully!',
      updateFailed: 'Failed to update: Account - {{accountError}}, Profile - {{profileError}}',
      error: 'Error',
      updateError: 'An error occurred during update. Please try again.',
      usernameLabel: 'User name',
      nameLabel: 'Name',
      dobLabel: 'Date of birth',
      dobPlaceholder: 'DD-MM-YYYY',
      emailLabel: 'Email',
      currentPasswordLabel: 'Current password',
      newPasswordLabel: 'New password',
      passwordLength: 'At least 8 characters',
      passwordNumber: 'One number',
      passwordUppercase: 'One uppercase letter',
      passwordSpecialChar: 'One special character',
      passwordLowercase: 'One lowercase letter',
      edit: 'Edit',
      save: 'Save',
      ok: 'OK',
      saved: 'Saved',
      saving: 'Saving...',

      diseaseSuggestions: {
        Blight: [
          "Apply a broad-spectrum fungicide containing chlorothalonil or mancozeb.",
          "Remove and destroy severely affected leaves to reduce spore spread.",
          "Improve air circulation by spacing plants properly and pruning excess foliage."
        ],
        Common_Rust: [
          "Remove infected leaves as soon as possible.",
          "Apply copper-based fungicide or sulfur-based spray in early stages.",
          "Avoid excessive nitrogen fertilizer to reduce susceptibility."
        ],
        Gray_Leaf_Spot: [
          "Use fungicides containing azoxystrobin, pyraclostrobin, or mancozeb.",
          "Ensure proper drainage and avoid waterlogged conditions.",
          "Practice crop rotation with non-host crops."
        ],
        Healthy: [
          "Plant appears healthy. Continue regular monitoring."
        ],
        Default: [
          "Consult with agricultural extension services for proper treatment."
        ]
      },
    },
  },
  zh: {
    translation: {
      //user/translate
      welcome: '欢迎使用应用',
      switchLanguage: '切换语言',
      selectLanguage: '请选择您的语言',
      languageChanged: '语言已更改为 {{lang}}',

      //user/dashboard
      uploadImage: '图片上传',
      dashboard: '主页',
      comment: '评论',
      translate: '翻译',
      logout: '登出',
      subscription: '订阅',
      logoutConfirm: '您确定要退出登录吗？',
      yes: '是',
      cancel: '取消',
      faqHelp: '常见问题 / 帮助',
      reportBug: '报告错误',
      resultHistory: '历史结果',

      //user/upload
      uploadMaizeImages: '上传玉米图片',
      dragAndDrop: "拖拽图片{{isPremium}}或",
      browse: '浏览',
      supportedFormats: "支持 {{formats}}",
      imageCount: '图片数量',
      reset: '重置',
      count: '计数',
      counting: '正在计数...',
      checkDisease: '检查病害 (高级用户)',
      checking: '正在检查...',
      premiumFeatureAlert: '只有高级用户可以上传ZIP文件/多张图片并使用病害检测功能。',
      notMaizeConfirm: '这似乎不是玉米，您确定要继续吗？',
      continueDetection: '继续检测',
      singleLeafTip: '为获得最佳效果，请使用单片叶子',
      continueDetectionAcknowledge: '我知晓，继续检测',
      results: '结果',
      result: '结果',
      remove: '移除',
      uploadImageFirstAlert: '请先上传一张图片',
      freeUserMultiUploadAlert: '免费用户只能上传一张图片。',
      zipUploadPremiumAlert: '只有高级用户才能上传ZIP文件。',
      detectionFailed: '检测失败',
      countFailed: '计数失败',
      diseaseDetectionFailed: '病害检测失败',
      analysisResult: "分析结果",
      disease: "病害",
      diseaseNames: {
        Blight: "枯萎病",
        Common_Rust: "普通锈病",
        Gray_Leaf_Spot: "灰斑病",
        Healthy: "健康"
      },
      viewImage: "查看图片",
      suggestions: "建议",
      actions: "操作",
      remainingImages: '剩余',
      images: '张',




      //user/bug
      reportBugTitle: '报告错误',
      reportABug: '报告错误',
      bugTitleLabel: '错误标题',
      descriptionLabel: '描述',
      titleDescriptionEmpty: '标题和描述不能为空。',
      submissionFailed: '提交错误报告失败。请重试。',
      submitBugReport: '提交错误报告',
      bugReportSubmitted: '错误报告提交成功',

      //user/FAQ
      faqHelpTitle: '常见问题 / 帮助',
      faqHelpDocument: '常见问题 / 帮助文档',
      searchPlaceholder: '搜索帮助主题...',
      loadingFAQs: '正在加载常见问题...',
      failedToLoadFAQs: '加载常见问题失败。请检查后端服务器是否正在运行或稍后重试。',
      retry: '重试',
      noFaqsFound: '没有找到与您的搜索匹配的常见问题。',
      noFaqsInDatabase: '数据库中没有可用的常见问题。',
      stillNeedHelp: '仍然需要帮助？联系支持',

      //user/subscription
      subscriptionPlan: '订阅计划',
      chooseYourPlan: '选择您的计划',
      freePlan: '免费版',
      freePrice: '¥0',
      basicCount: '基本计数',
      zipUpload: 'ZIP上传',
      multiImageUpload: '多张图片上传',
      currentPlan: '当前计划',
      premiumPlan: '高级版',
      premiumPrice: '¥20',
      daysRemaining: '剩余 {{daysRemaining}} 天',
      expires: '到期日',
      allFeatures: '所有功能',
      diseaseDetection: '病害检测',
      upgrade: '升级',
      securePaymentNote: '安全支付。可在月底取消。',
      paymentSuccessfulAlert: '支付成功！您的高级会员资格现已激活。',
      completeYourPurchase: '完成您的购买',
      fullNameLabel: '全名',
      enterYourNameAlert: '请输入您的姓名',
      fullNamePlaceholder: '输入您的全名',
      cardDetailsLabel: '银行卡信息',
      processingPayment: '处理中...',
      payNow: '立即支付',
      paymentFailedAlert: '支付失败。请重试。',
      perMonth: '月',

      //user/comment
      viewCommentsTitle: '查看评论',
      userComments: '用户评论',
      loadingComments: '正在加载评论...',
      failedToLoadComments: '加载评论失败。请稍后重试。',
      noCommentsAvailable: '暂无评论。',
      anonymous: '匿名',
      unknownTime: '未知时间',
      agentReply: '代理回复',
      loading: '加载中...',
      loadMore: '加载更多',
      addComment: '添加评论',

      //user/result
      viewResultTitle: '结果历史',
      myResults: '我的结果',
      view: '查看',
      delete: '删除',
      AddNote: '添加备注',
      AddDescription: '为此结果添加您的描述',
      EnterNote: '在此输入您的备注...',
      imageSavedSuccess: '图片已成功保存！',
      saveImageError: '保存图片失败，请重试！',


      //user/viewResult
      detectionResultTitle: '检测结果',
      detectionResult: '检测结果',
      totalMaizeCount: '玉米总数',
      processingTime: '处理时间',
      imageSize: '图片大小',
      back: '返回',
      Date: '日期',
      type: '检测类型',
      searchResults: '搜索结果或者备注',
      number: '序号',
      note: '备注',
      date: '日期',
      imageId: '图片ID',
      id: '序号',
      maizeCount: '玉米计数',
    
      

      //user/dashboard
      weatherInSingapore: '新加坡天气',
      loadingWeather: '正在加载天气...',
      failedToLoadWeather: '加载天气数据失败。请重试。',
      today: '今天',
      wind: '风速',
      kmPerHour: '公里/小时',
      humidity: '湿度',
      loadingForecast: '正在加载预报...',
      lastUpdated: '上次更新',
      hint: '未来七天的天气预报',

      //user/updateAcc
      updateAccountTitle: '更新账户',
      updateAccount: '更新账户',
      loadingAccountData: '正在加载账户数据...',
      missingAccountOrProfileID: '账户或个人资料ID缺失。请重新登录。',
      fetchDataError: '获取数据失败：{{message}}。请检查网络或认证。',
      fetchDataFailedMessage: '获取数据时发生错误！',
      accountIdNotAvailable: '账户ID不可用，请重新登录！',
      enterCurrentPassword: '请输入您当前的密码以进行更改。',
      newPasswordRequirements: '新密码不满足所有要求！',
      passwordChangeFailed: '更改密码失败：{{detail}}',
      somethingWentWrong: '发生了一些错误。',
      passwordChangeSuccess: '密码更改成功！',
      passwordChangeError: '更改密码时发生错误。请重试。',
      updateSuccess: '账户和个人资料详情更新成功！',
      updateFailed: '更新失败：账户 - {{accountError}}，个人资料 - {{profileError}}',
      error: '错误',
      updateError: '更新时发生错误。请重试。',
      usernameLabel: '用户名',
      nameLabel: '姓名',
      dobLabel: '出生日期',
      dobPlaceholder: '日-月-年',
      emailLabel: '邮箱',
      currentPasswordLabel: '当前密码',
      newPasswordLabel: '新密码',
      passwordLength: '至少8个字符',
      passwordNumber: '一个数字',
      passwordUppercase: '一个大写字母',
      passwordSpecialChar: '一个特殊字符',
      passwordLowercase: '一个小写字母',
      edit: '编辑',
      save: '保存',
      ok: '确定',
      saved: '已保存',
      saving: '正在保存...',

      
      diseaseSuggestions: {
        Blight: [
          "使用含百菌清或代森锰锌的广谱杀菌剂。",
          "移除并销毁严重受害的叶片以减少孢子传播。",
          "通过合理间距和修剪多余叶片改善通风。"
        ],
        Common_Rust: [
          "尽快移除受感染的叶片。",
          "在早期喷施含铜杀菌剂或硫基喷剂。",
          "避免过量施用氮肥以降低易感性。"
        ],
        Gray_Leaf_Spot: [
          "使用含嘧菌酯、吡唑醚菌酯或代森锰锌的杀菌剂。",
          "保证排水良好，避免积水。",
          "与非寄主作物进行轮作。"
        ],
        Healthy: [
          "植物健康，继续日常监测。"
        ],
        Default: [
          "请咨询农业推广部门以获得正确的防治方法。"
        ]
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React handles XSS
    },
  });

export default i18n;