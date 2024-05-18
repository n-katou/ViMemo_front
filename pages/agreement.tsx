// pages/agreement.js
import React from 'react';

const Agreement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">利用規約</h1>
      <p>この利用規約（以下，「本規約」といいます。）は，＿＿＿＿＿（以下，「当社」といいます。）がこのウェブサイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。</p>

      <div className="space-y-4">
        {/* 第1条 */}
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="font-semibold text-xl">第1条（適用）</h2>
          <p>本規約は，ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>
        </div>
        {/* 第2条 */}
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="font-semibold text-xl">第2条（利用登録）</h2>
          <p>本サービスにおいては，登録希望者が本規約に同意の上，当社の定める方法によって利用登録を申請し，当社がこの承認を登録希望者に通知することによって，利用登録が完了するものとします。</p>
        </div>
        {/* 第3条 */}
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="font-semibold text-xl">第3条（ユーザーIDおよびパスワードの管理）</h2>
          <p>ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。当社は、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。</p>
        </div>
        {/* 第4条 */}
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="font-semibold text-xl">第4条（禁止事項）</h2>
          <p>ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。</p>
          <ul className="list-disc pl-5">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            {/* 他の禁止事項もここにリスト形式で追加 */}
          </ul>
        </div>
        {/* 第5条 */}
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="font-semibold text-xl">第5条（本サービスの提供の停止等）</h2>
          <p>当社は，以下のいずれかの事由があると判断した場合，ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。本サービスの提供の停止または中断により，ユーザーまたは第三者が被ったいかなる不利益または損害についても，一切の責任を負わないものとします。</p>
        </div>
        {/* 第6条 */}
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="font-semibold text-xl">第6条（著作権）</h2>
          <p>ユーザーは，自ら著作権等の必要な知的財産権を有するか，または必要な権利者の許諾を得た文章，画像や映像等の情報に関してのみ，本サービスを利用し，投稿ないしアップロードすることができるものとします。</p>
        </div>
        {/* 第7条 */}
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="font-semibold text-xl">第7条（利用制限および登録抹消）</h2>
          <p>当社は，ユーザーが以下のいずれかに該当する場合には，事前の通知なく，投稿データを削除し，ユーザーに対して本サービスの全部もしくは一部の利用を制限しまたはユーザーとしての登録を抹消することができるものとします。</p>
          <ul className="list-disc pl-5">
            <li>本規約のいずれかの条項に違反した場合</li>
            <li>その他，当社が本サービスの利用を適当でないと判断した場合</li>
          </ul>
        </div>
        {/* 第8条 */}
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="font-semibold text-xl">第8条（サービス内容の変更等）</h2>
          <p>当社は，ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。</p>
        </div>
        {/* 第9条 */}
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="font-semibold text-xl">第9条（利用規約の変更）</h2>
          <p>当社は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができます。本規約の変更がユーザーの一般の利益に適合するとき。変更が合理的であるとき。当社は、変更内容とその効力発生時期をユーザーに事前に通知します。</p>
        </div>
        {/* 第10条 */}
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="font-semibold text-xl">第10条（個人情報の取扱い）</h2>
          <p>当社は，本サービスの利用によって取得する個人情報については，当社「プライバシーポリシー」に従い適切に取り扱うものとします。</p>
        </div>
        {/* 第11条 */}
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="font-semibold text-xl">第11条（通知または連絡）</h2>
          <p>ユーザーと当社との間の通知または連絡は，当社の定める方法によって行います。連絡先に変更がない限り、現在登録されている連絡先が有効とみなされます。</p>
        </div>
        {/* 第12条 */}
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="font-semibold text-xl">第12条（権利義務の譲渡の禁止）</h2>
          <p>ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。</p>
        </div>
        <p>以上、利用規約とする</p>
      </div>
    </div>
  );
};

export default Agreement;
